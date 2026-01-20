import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";
import { 
  validateName, 
  validateEmail, 
  validatePhone, 
  sanitizeNotes,
  validateFile
} from "../lib/validation.js";

export default function FormsPage() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [selectedFormId, setSelectedFormId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    const lang = i18n.resolvedLanguage;
    fetch(getApiUrl(`/api/forms?lang=${encodeURIComponent(lang || "")}`))
      .then((r) => r.json())
      .then(setItems);
  }, [i18n.resolvedLanguage]);
  return (
    <main className="container mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-sudan-black mb-4 md:mb-6">
        {t("forms.title")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {items.map((f) => (
          <div
            key={f.id}
            className="border rounded p-3 md:p-4 bg-white flex items-start gap-2 md:gap-3"
          >
            <div className="bg-sudan-green text-white rounded-full h-8 w-8 md:h-10 md:w-10 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-file-pdf text-sm md:text-base" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm md:text-base">{f.title}</h3>
              <p className="text-xs md:text-sm text-gray-600">{f.description}</p>
              <a
                href={f.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sudan-blue hover:underline mt-1 inline-flex items-center text-xs md:text-sm"
              >
                <i className="fa-solid fa-download me-1 md:me-2" />{" "}
                {t("common.download")} {f.fileName || ""}
              </a>
              <button
                className="ml-2 md:ml-3 text-sudan-green underline text-xs md:text-sm"
                onClick={() => {
                  setSelectedFormId(f.id);
                  document
                    .getElementById("submit-filled-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {t("forms.submit_filled")}
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-gray-500">{t("common.no_results")}</div>
        )}
      </div>

      <div
        id="submit-filled-form"
        className="bg-white rounded-lg shadow-sm p-6 mt-8"
      >
        <h2 className="text-xl font-semibold mb-3">
          {t("forms.submit_filled")}
        </h2>
        <p className="text-gray-600 mb-4">{t("forms.submit_help")}</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            try {
              // Validate and sanitize all inputs
              const validatedName = validateName(form.name);
              const validatedEmail = validateEmail(form.email);
              const validatedPhone = validatePhone(form.phone);
              const validatedNotes = sanitizeNotes(form.notes);
              const validatedFile = validateFile(file, {
                maxSize: 10 * 1024 * 1024, // 10MB
                allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/gif']
              });
              
              const fd = new FormData();
              fd.append("type", "form");
              fd.append("relatedId", selectedFormId);
              fd.append("name", validatedName);
              fd.append("email", validatedEmail);
              fd.append("phone", validatedPhone);
              fd.append("notes", validatedNotes);
              if (validatedFile) fd.append("file", validatedFile);
              const res = await fetch(getApiUrl("/api/submissions"), {
                method: "POST",
                body: fd,
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) throw new Error(data.error || "Failed to submit");
              setForm({ name: "", email: "", phone: "", notes: "" });
              setFile(null);
              setSelectedFormId("");
              window.dispatchEvent(
                new CustomEvent("toast", {
                  detail: {
                    type: "success",
                    text: t(
                      "common.submitted_success",
                      "Submitted successfully"
                    ),
                  },
                })
              );
            } catch (err) {
              window.dispatchEvent(
                new CustomEvent("toast", {
                  detail: { type: "error", text: err.message },
                })
              );
            } finally {
              setSubmitting(false);
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("forms.related_form")}
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedFormId}
              onChange={(e) => setSelectedFormId(e.target.value)}
            >
              <option value="">—</option>
              {items.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("forms.full_name")}
            </label>
            <input
              required
              minLength="2"
              maxLength="100"
              className="w-full border rounded px-3 py-2"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("forms.email")}
            </label>
            <input
              type="email"
              required
              className="w-full border rounded px-3 py-2"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("forms.phone")}
            </label>
            <input
              type="tel"
              required
              pattern="[\d\s\-\+\(\)]{7,20}"
              placeholder="+40 123 456 789"
              className="w-full border rounded px-3 py-2"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("forms.notes")}
            </label>
            <input
              maxLength="5000"
              className="w-full border rounded px-3 py-2"
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("forms.upload_filled")}
            </label>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              disabled={submitting}
              className="bg-sudan-green text-white px-6 py-2 rounded"
            >
              {submitting ? t("common.submitting") : t("common.submit")}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
