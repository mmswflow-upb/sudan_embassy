import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

export default function ConsularDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  useEffect(() => {
    const lang = i18n.resolvedLanguage;
    fetch(
      getApiUrl(
        `/api/consular-services/${id}?lang=${encodeURIComponent(lang || "")}`
      )
    )
      .then((r) => r.json())
      .then(setItem);
  }, [id, i18n.resolvedLanguage]);
  if (!item)
    return (
      <main className="container mx-auto px-4 py-10">
        {t("common.loading")}
      </main>
    );
  const fileUrl = item.attachmentUrl || item.image || "";
  const inferredType =
    item.attachmentType ||
    (fileUrl.endsWith(".pdf") ? "pdf" : fileUrl ? "image" : null);
  return (
    <main className="container mx-auto px-4 py-10">
      <Link to="/consular-services" className="text-sudan-blue">
        ← {t("pages.consular_services")}
      </Link>
      <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
        <div className="flex items-center gap-3 mb-3">
          <i className={`${item.icon} text-sudan-green`} />
          <h1 className="text-2xl font-bold">{item.name}</h1>
        </div>
        {inferredType === "image" && fileUrl && (
          <img
            src={fileUrl}
            alt={item.name}
            className="w-full max-w-xl rounded mb-4"
          />
        )}
        {inferredType === "pdf" && fileUrl && (
          <div className="mb-4">
            <iframe
              title="file"
              src={`${fileUrl}#toolbar=1`}
              className="w-full h-[480px] border rounded"
            ></iframe>
          </div>
        )}
        {fileUrl && (
          <a
            className="inline-flex items-center text-sudan-blue underline mb-4"
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-solid fa-download mr-2" /> {t("common.download")}{" "}
            {item.fileName || "file"}
          </a>
        )}
        <p className="text-gray-700 whitespace-pre-line mb-6">{item.details}</p>

        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-3">
            {t("forms.submit_filled")}
          </h2>
          <p className="text-gray-600 mb-4">{t("forms.submit_help")}</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              try {
                const fd = new FormData();
                fd.append("type", "consular");
                fd.append("relatedId", id);
                fd.append("name", form.name);
                fd.append("email", form.email);
                fd.append("phone", form.phone);
                fd.append("notes", form.notes);
                if (file) fd.append("file", file);
                const res = await fetch(getApiUrl("/api/submissions"), {
                  method: "POST",
                  body: fd,
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.error || "Failed to submit");
                setForm({ name: "", email: "", phone: "", notes: "" });
                setFile(null);
                window.dispatchEvent(
                  new CustomEvent("toast", {
                    detail: { type: "success", text: "Submitted successfully" },
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
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("forms.full_name")}
              </label>
              <input
                required
                className="w-full border rounded px-3 py-2"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
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
                required
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
      </div>
    </main>
  );
}
