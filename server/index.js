const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const fs = require("fs");
const session = require("express-session");
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

// Basic in-memory credential store (can be changed via admin endpoint)
const credentials = {
  username: "embassy",
  password: "123",
};

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://sudan-embassy.web.app",
      "https://sudan-embassy.firebaseapp.com",
    ],
    credentials: true,
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "replace_this_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" },
  })
);

// Multer memory storage for file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  res.json({ message: "API up" });
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
  if (req.session && req.session.user) return next();
  const decoded = await verifyIdToken(req.headers.authorization);
  if (decoded) {
    req.user = decoded;
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
}

// (upload middleware defined above)

// Auth routes
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === credentials.username && password === credentials.password) {
    req.session.user = { username };
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: "Invalid credentials" });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/me", (req, res) => {
  if (req.session.user)
    return res.json({ authenticated: true, user: req.session.user });
  return res.json({ authenticated: false });
});

// Protect middleware
function requireAuth(req, res, next) {
  if (req.session.user) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

// Admin endpoints
app.get("/api/admin/secret", requireAuth, (req, res) => {
  res.json({ message: "Admin data placeholder" });
});

app.post("/api/admin/credentials", requireAuth, (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });
  credentials.username = String(username);
  credentials.password = String(password);
  res.json({ ok: true });
});

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
    snap.docs.map((d) => resolveI18n(d.data(), lang, ["name", "details"]))
  );
});

app.get("/api/consular-services/:id", async (req, res) => {
  const lang = (req.query.lang || "").trim();
  const doc = await db.collection("consularServices").doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: "Not found" });
  res.json(resolveI18n(doc.data(), lang, ["name", "details"]));
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
  await db.collection("consularServices").doc(req.params.id).delete();
  res.json({ ok: true });
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
    snap.docs.map((d) =>
      resolveI18n(d.data(), lang, ["title", "summary", "tag"])
    )
  );
});

app.get("/api/news/:id", async (req, res) => {
  const lang = (req.query.lang || "").trim();
  const doc = await db.collection("news").doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: "Not found" });
  res.json(resolveI18n(doc.data(), lang, ["title", "summary", "tag"]));
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
  await db.collection("news").doc(req.params.id).delete();
  res.json({ ok: true });
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
  const settings = await readSettings();
  res.json(settings);
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
    snap.docs.map((d) => resolveI18n(d.data(), lang, ["message", "level"]))
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

app.delete("/api/alerts/:id", requireAnyAuth, async (req, res) => {
  await db.collection("alerts").doc(req.params.id).delete();
  res.json({ ok: true });
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
    snap.docs.map((d) => resolveI18n(d.data(), lang, ["title", "description"]))
  );
});

app.get("/api/forms/:id", async (req, res) => {
  const lang = (req.query.lang || "").trim();
  const doc = await db.collection("forms").doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: "Not found" });
  res.json(resolveI18n(doc.data(), lang, ["title", "description"]));
});

app.delete("/api/forms/:id", requireAnyAuth, async (req, res) => {
  await db.collection("forms").doc(req.params.id).delete();
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
