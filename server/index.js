const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { db, bucket, verifyIdToken } = require("./firebaseAdmin");
let mailer = null;
let transporter = null;
try {
  mailer = require("nodemailer");
  transporter = mailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: Boolean(process.env.SMTP_SECURE || false),
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
} catch (_) {
  console.warn("nodemailer not installed; emails will be logged to console.");
}

const app = express();
const PORT = process.env.PORT || 3000;

// Parse CORS origins from environment variable or use defaults
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Multer memory storage for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to delete file from storage
async function deleteFileFromStorage(fileUrl) {
  if (!fileUrl || !bucket?.name) return;
  try {
    // Extract file path from URL
    const urlPattern = new RegExp(`https://storage\\.googleapis\\.com/${bucket.name}/(.+)`);
    const match = fileUrl.match(urlPattern);
    if (match && match[1]) {
      const filePath = decodeURIComponent(match[1]);
      await bucket.file(filePath).delete();
      console.log(`Deleted file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error deleting file from storage: ${error.message}`);
  }
}

app.get("/", (req, res) => {
  res.json({ message: "API up" });
});

// Health check endpoint for Cloud Run
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Server-side upload to Firebase Storage to avoid client-side CORS
app.post(
  "/api/upload",
  requireAnyAuth,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "file is required" });
      const folder = req.query.folder || req.body?.folder || "uploads";
      const id = uuidv4();
      const safe = (req.file.originalname || "file").replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );
      const objectPath = `${folder}/${id}-${safe}`;
      if (!bucket?.name)
        return res.status(500).json({
          error:
            "Storage bucket not configured. Check FIREBASE_BUCKET or serviceAccount project_id.",
        });
      const file = bucket.file(objectPath);
      await file.save(req.file.buffer, {
        contentType: req.file.mimetype,
        public: true,
      });
      await file.makePublic();
      const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      res.json({ ok: true, url, path: objectPath });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

// Public submissions (no auth): accepts file + contact details and stores in Firestore
app.post("/api/submissions", upload.single("file"), async (req, res) => {
  try {
    const {
      type = "consular",
      relatedId = "",
      name = "",
      email = "",
      phone = "",
      notes = "",
    } = req.body || {};
    if (!name || !email || !phone)
      return res.status(400).json({ error: "name, email, phone are required" });
    let uploaded = { url: null, path: null, fileName: null, fileType: null };
    if (req.file) {
      const safe = (req.file.originalname || "file").replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );
      const objectPath = `submissions/${uuidv4()}-${safe}`;
      if (!bucket?.name)
        return res.status(500).json({
          error:
            "Storage bucket not configured. Check FIREBASE_BUCKET or serviceAccount project_id.",
        });
      const f = bucket.file(objectPath);
      await f.save(req.file.buffer, {
        contentType: req.file.mimetype,
        public: true,
      });
      await f.makePublic();
      uploaded = {
        url: `https://storage.googleapis.com/${bucket.name}/${f.name}`,
        path: objectPath,
        fileName: safe,
        fileType: req.file.mimetype,
      };
    }
    const id = uuidv4();
    const doc = {
      id,
      type,
      relatedId,
      name,
      email,
      phone,
      notes,
      fileUrl: uploaded.url,
      fileName: uploaded.fileName,
      fileType: uploaded.fileType,
      createdAt: Date.now(),
      status: "new",
    };
    await db.collection("submissions").doc(id).set(doc);

    // Send email notification if transporter available
    try {
      const settings = await readSettings();
      const toEmail =
        settings?.receiveEmail ||
        settings?.contactEmail ||
        settings?.header?.email ||
        process.env.ADMIN_EMAIL ||
        "info@sudanembassy.ro";
      const subject = `New ${type} submission`;
      const text = `A new ${type} submission has been received.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nRelated ID: ${relatedId}\nNotes: ${notes}\nFile: ${
        uploaded.url || "—"
      }\n\nAdmin: http://localhost:5173/admin`;
      if (transporter && toEmail) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || "no-reply@sudanembassy.local",
          to: toEmail,
          subject,
          text,
        });
      } else {
        console.log("[EMAIL MOCK]", { to: toEmail, subject, text });
      }
    } catch (e) {
      console.warn("Email send failed or not configured:", e.message);
    }

    res.json({ ok: true, data: doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: list submissions
app.get("/api/submissions", requireAnyAuth, async (req, res) => {
  const { type } = req.query || {};
  let ref = db.collection("submissions");
  if (type) ref = ref.where("type", "==", String(type));
  const snap = await ref.orderBy("createdAt", "desc").get();
  res.json(snap.docs.map((d) => d.data()));
});

// Admin: update submission status
app.patch("/api/submissions/:id", requireAnyAuth, async (req, res) => {
  const id = req.params.id;
  await db
    .collection("submissions")
    .doc(id)
    .set({ ...req.body, id }, { merge: true });
  res.json({ ok: true });
});

// Firebase-authenticated middleware (Bearer token from client). Not used yet on frontend
async function requireFirebaseAuth(req, res, next) {
  const decoded = await verifyIdToken(req.headers.authorization);
  if (!decoded) return res.status(401).json({ error: "Unauthorized" });
  req.user = decoded;
  next();
}

async function requireAnyAuth(req, res, next) {
  const decoded = await verifyIdToken(req.headers.authorization);
  if (decoded) {
    req.user = decoded;
    return next();
  }
  return res.status(401).json({ error: "Unauthorized - Firebase authentication required" });
}

// (upload middleware defined above)

// Consular Services CRUD (Firebase-auth protected)
app.post("/api/consular-services", requireAnyAuth, async (req, res) => {
  try {
    const id = uuidv4();
    const {
      name = "",
      icon = "",
      details = "",
      image = null,
      attachmentUrl = null,
      attachmentType = null,
      fileName = null,
      i18n: i18nBody = {},
    } = req.body || {};
    const data = {
      id,
      name,
      icon,
      details,
      image,
      attachmentUrl: attachmentUrl || image,
      attachmentType: attachmentType || (image ? "image" : null),
      fileName: fileName || null,
      createdAt: Date.now(),
      i18n: i18nBody || {},
    };
    await db.collection("consularServices").doc(id).set(data);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

function resolveI18n(doc, lang, fields) {
  if (!lang || !doc || !doc.i18n || !doc.i18n[lang]) return doc;
  const out = { ...doc };
  const tr = doc.i18n[lang];
  fields.forEach((f) => {
    if (tr[f]) out[f] = tr[f];
  });
  return out;
}

app.get("/api/consular-services", async (req, res) => {
  const lang = (req.query.lang || "").trim();
  const snap = await db
    .collection("consularServices")
    .orderBy("createdAt", "desc")
    .get();
  res.json(
    snap.docs.map((d) => {
      const data = resolveI18n(d.data(), lang, ["name", "details"]);
      return { ...data, id: d.id };
    })
  );
});

app.get("/api/consular-services/:id", async (req, res) => {
  const lang = (req.query.lang || "").trim();
  const doc = await db.collection("consularServices").doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: "Not found" });
  res.json({ id: doc.id, ...resolveI18n(doc.data(), lang, ["name", "details"]) });
});

app.put("/api/consular-services/:id", requireAnyAuth, async (req, res) => {
  const id = req.params.id;
  await db
    .collection("consularServices")
    .doc(id)
    .set({ ...req.body, id }, { merge: true });
  res.json({ ok: true });
});

app.delete("/api/consular-services/:id", requireAnyAuth, async (req, res) => {
  try {
    const doc = await db.collection("consularServices").doc(req.params.id).get();
    if (doc.exists) {
      const data = doc.data();
      // Delete associated files
      if (data.attachmentUrl) await deleteFileFromStorage(data.attachmentUrl);
      if (data.image) await deleteFileFromStorage(data.image);
    }
    await db.collection("consularServices").doc(req.params.id).delete();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Appointments
app.post("/api/appointments", async (req, res) => {
  const id = uuidv4();
  const data = { id, ...req.body, createdAt: Date.now(), status: "pending" };
  await db.collection("appointments").doc(id).set(data);
  res.json({ ok: true, data });
});

app.get("/api/appointments", requireAnyAuth, async (req, res) => {
  const snap = await db
    .collection("appointments")
    .orderBy("createdAt", "desc")
    .get();
  res.json(snap.docs.map((d) => d.data()));
});

app.patch("/api/appointments/:id", requireAnyAuth, async (req, res) => {
  const id = req.params.id;
  await db
    .collection("appointments")
    .doc(id)
    .set({ ...req.body, id }, { merge: true });
  res.json({ ok: true });
});

app.delete("/api/appointments/:id", requireAnyAuth, async (req, res) => {
  const id = req.params.id;
  await db.collection("appointments").doc(id).delete();
  res.json({ ok: true });
});

// News
app.post("/api/news", requireAnyAuth, async (req, res) => {
  try {
    const id = uuidv4();
    const {
      title = "",
      summary = "",
      tag = "",
      image = null,
      attachmentUrl = null,
      attachmentType = null,
      fileName = null,
      i18n: i18nBody = {},
    } = req.body || {};
    const data = {
      id,
      title,
      summary,
      tag,
      image,
      attachmentUrl: attachmentUrl || image,
      attachmentType: attachmentType || (image ? "image" : null),
      fileName: fileName || null,
      createdAt: Date.now(),
      i18n: i18nBody || {},
    };
    await db.collection("news").doc(id).set(data);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/news", async (req, res) => {
  const lang = (req.query.lang || "").trim();
  const snap = await db.collection("news").orderBy("createdAt", "desc").get();
  res.json(
    snap.docs.map((d) => {
      const data = resolveI18n(d.data(), lang, ["title", "summary", "tag"]);
      return { ...data, id: d.id };
    })
  );
});

app.get("/api/news/:id", async (req, res) => {
  const lang = (req.query.lang || "").trim();
  const doc = await db.collection("news").doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: "Not found" });
  res.json({ id: doc.id, ...resolveI18n(doc.data(), lang, ["title", "summary", "tag"]) });
});

app.put("/api/news/:id", requireAnyAuth, async (req, res) => {
  const id = req.params.id;
  await db
    .collection("news")
    .doc(id)
    .set({ ...req.body, id }, { merge: true });
  res.json({ ok: true });
});

app.delete("/api/news/:id", requireAnyAuth, async (req, res) => {
  try {
    const doc = await db.collection("news").doc(req.params.id).get();
    if (doc.exists) {
      const data = doc.data();
      // Delete associated files
      if (data.attachmentUrl) await deleteFileFromStorage(data.attachmentUrl);
      if (data.image) await deleteFileFromStorage(data.image);
    }
    await db.collection("news").doc(req.params.id).delete();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reorder endpoints
app.put("/api/consular-services/order", requireAnyAuth, async (req, res) => {
  const { order = [] } = req.body || {};
  const batch = db.batch();
  order.forEach((id, index) => {
    batch.set(
      db.collection("consularServices").doc(id),
      { order: index },
      { merge: true }
    );
  });
  await batch.commit();
  res.json({ ok: true });
});

app.put("/api/news/order", requireAnyAuth, async (req, res) => {
  const { order = [] } = req.body || {};
  const batch = db.batch();
  order.forEach((id, index) => {
    batch.set(db.collection("news").doc(id), { order: index }, { merge: true });
  });
  await batch.commit();
  res.json({ ok: true });
});

// Site settings
const SETTINGS_DOC = "site";
const SETTINGS_FILE = path.join(__dirname, "settings.json");

async function readSettings() {
  try {
    const doc = await db.collection("settings").doc(SETTINGS_DOC).get();
    if (doc.exists) return doc.data();
  } catch (e) {
    console.warn(
      "Firestore settings read failed, using file fallback:",
      e.message
    );
  }
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
    }
  } catch (e) {
    console.warn("File settings read failed:", e.message);
  }
  return {};
}

async function writeSettings(data) {
  try {
    await db
      .collection("settings")
      .doc(SETTINGS_DOC)
      .set(data || {}, { merge: true });
    return { ok: true, source: "firestore" };
  } catch (e) {
    console.warn(
      "Firestore settings write failed, writing to file:",
      e.message
    );
    try {
      fs.writeFileSync(
        SETTINGS_FILE,
        JSON.stringify(data || {}, null, 2),
        "utf8"
      );
      return { ok: true, source: "file" };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }
}

app.get("/api/settings", async (req, res) => {
  const lang = (req.query.lang || "").trim();
  const settings = await readSettings();
  
  // If no language specified or no i18n data, return as-is
  if (!lang || !settings.i18n || !settings.i18n[lang]) {
    return res.json(settings);
  }
  
  // Resolve i18n translations for hero, statusBar, emergency, contacts, promoSlides
  const translated = { ...settings };
  const i18nData = settings.i18n[lang];
  
  // Hero translations
  if (i18nData.hero) {
    translated.hero = { ...settings.hero };
    if (i18nData.hero.title) translated.hero.title = i18nData.hero.title;
    if (i18nData.hero.subtitle) translated.hero.subtitle = i18nData.hero.subtitle;
    if (i18nData.hero.cta1) translated.hero.cta1 = i18nData.hero.cta1;
    if (i18nData.hero.cta2) translated.hero.cta2 = i18nData.hero.cta2;
  }
  
  // StatusBar translations
  if (i18nData.statusBar) {
    translated.statusBar = { ...settings.statusBar };
    if (i18nData.statusBar.status) translated.statusBar.status = i18nData.statusBar.status;
    if (i18nData.statusBar.holiday) translated.statusBar.holiday = i18nData.statusBar.holiday;
    if (i18nData.statusBar.nextAppointment) translated.statusBar.nextAppointment = i18nData.statusBar.nextAppointment;
  }
  
  // Emergency note translation
  if (i18nData.emergency && i18nData.emergency.note) {
    translated.emergency = { ...settings.emergency, note: i18nData.emergency.note };
  }
  
  // Hours translations
  if (i18nData.hours) {
    translated.hours = { ...settings.hours };
    if (i18nData.hours.monThu) translated.hours.monThu = i18nData.hours.monThu;
    if (i18nData.hours.fri) translated.hours.fri = i18nData.hours.fri;
  }
  
  // Contact text translations (object structure)
  if (i18nData.contacts && typeof i18nData.contacts === 'object') {
    translated.contacts = { ...settings.contacts };
    for (const key in settings.contacts) {
      if (i18nData.contacts[key]) {
        // Keep the icon, replace the text
        translated.contacts[key] = [settings.contacts[key][0], i18nData.contacts[key]];
      }
    }
  }
  
  // Promo slides translations (handle object structure)
  if (i18nData.promoSlides && typeof i18nData.promoSlides === 'object') {
    translated.promoSlides = {};
    for (const key in settings.promoSlides) {
      const slide = settings.promoSlides[key];
      const i18nSlide = i18nData.promoSlides[key];
      if (i18nSlide) {
        translated.promoSlides[key] = {
          ...slide,
          title: i18nSlide.title || slide.title,
          subtitle: i18nSlide.subtitle || slide.subtitle,
          cta: i18nSlide.cta || slide.cta,
        };
      } else {
        translated.promoSlides[key] = slide;
      }
    }
  }
  
  res.json(translated);
});

app.put("/api/settings", requireAnyAuth, async (req, res) => {
  const result = await writeSettings(req.body);
  if (!result.ok) return res.status(500).json({ error: result.error });
  res.json(result);
});

// Contact email endpoint (public)
app.post("/api/contact", async (req, res) => {
  try {
    const { name = "", email = "", message = "" } = req.body || {};
    if (!name || !email || !message)
      return res
        .status(400)
        .json({ error: "name, email, message are required" });
    const settings = await readSettings();
    const toEmail =
      settings?.receiveEmail ||
      settings?.contactEmail ||
      settings?.header?.email ||
      process.env.ADMIN_EMAIL;
    const subject = `Contact form from ${name}`;
    const text = `New contact message:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    try {
      if (transporter && toEmail) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || "no-reply@sudanembassy.local",
          to: toEmail,
          subject,
          text,
        });
      } else {
        console.log("[CONTACT EMAIL MOCK]", { to: toEmail, subject, text });
      }
    } catch (e) {
      console.warn("Contact email send failed:", e.message);
    }
    // Optional: store as submission
    try {
      const id = uuidv4();
      await db.collection("submissions").doc(id).set({
        id,
        type: "contact",
        name,
        email,
        phone: "",
        notes: message,
        createdAt: Date.now(),
        status: "new",
      });
    } catch {}
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Alerts
app.post("/api/alerts", requireAnyAuth, async (req, res) => {
  const id = uuidv4();
  const {
    message = "",
    level = "info",
    attachmentUrl = null,
    attachmentType = null,
    fileName = null,
    active = true,
    i18n: i18nBody = {},
  } = req.body || {};
  const data = {
    id,
    message,
    level,
    attachmentUrl,
    attachmentType,
    fileName,
    createdAt: Date.now(),
    active,
    i18n: i18nBody || {},
  };
  await db.collection("alerts").doc(id).set(data);
  res.json({ ok: true, data });
});

app.get("/api/alerts", async (req, res) => {
  const lang = (req.query.lang || "").trim();
  const snap = await db.collection("alerts").orderBy("createdAt", "desc").get();
  res.json(
    snap.docs.map((d) => {
      const data = resolveI18n(d.data(), lang, ["message", "level"]);
      return { ...data, id: d.id };
    })
  );
});

app.patch("/api/alerts/:id", requireAnyAuth, async (req, res) => {
  const id = req.params.id;
  await db
    .collection("alerts")
    .doc(id)
    .set({ ...req.body, id }, { merge: true });
  res.json({ ok: true });
});

app.put("/api/alerts/:id", requireAnyAuth, async (req, res) => {
  const id = req.params.id;
  await db
    .collection("alerts")
    .doc(id)
    .set({ ...req.body, id }, { merge: true });
  res.json({ ok: true });
});

app.delete("/api/alerts/:id", requireAnyAuth, async (req, res) => {
  try {
    const doc = await db.collection("alerts").doc(req.params.id).get();
    if (doc.exists) {
      const data = doc.data();
      // Delete associated file
      if (data.attachmentUrl) await deleteFileFromStorage(data.attachmentUrl);
    }
    await db.collection("alerts").doc(req.params.id).delete();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Forms & Downloads
app.post("/api/forms", requireAnyAuth, async (req, res) => {
  const id = uuidv4();
  const {
    title = "",
    description = "",
    fileUrl = null,
    fileType = null,
    fileName = null,
    i18n: i18nBody = {},
  } = req.body || {};
  if (!fileUrl) return res.status(400).json({ error: "fileUrl is required" });
  const data = {
    id,
    title,
    description,
    fileUrl,
    fileType,
    fileName,
    createdAt: Date.now(),
    i18n: i18nBody || {},
  };
  await db.collection("forms").doc(id).set(data);
  res.json({ ok: true, data });
});

app.get("/api/forms", async (req, res) => {
  const lang = (req.query.lang || "").trim();
  const snap = await db.collection("forms").orderBy("createdAt", "desc").get();
  res.json(
    snap.docs.map((d) => {
      const data = resolveI18n(d.data(), lang, ["title", "description"]);
      return { ...data, id: d.id };
    })
  );
});

app.get("/api/forms/:id", async (req, res) => {
  const lang = (req.query.lang || "").trim();
  const doc = await db.collection("forms").doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: "Not found" });
  res.json({ id: doc.id, ...resolveI18n(doc.data(), lang, ["title", "description"]) });
});

app.put("/api/forms/:id", requireAnyAuth, async (req, res) => {
  const id = req.params.id;
  await db
    .collection("forms")
    .doc(id)
    .set({ ...req.body, id }, { merge: true });
  res.json({ ok: true });
});

app.delete("/api/forms/:id", requireAnyAuth, async (req, res) => {
  try {
    const doc = await db.collection("forms").doc(req.params.id).get();
    if (doc.exists) {
      const data = doc.data();
      // Delete associated file
      if (data.fileUrl) await deleteFileFromStorage(data.fileUrl);
    }
    await db.collection("forms").doc(req.params.id).delete();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
