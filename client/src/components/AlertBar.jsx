import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

export default function AlertBar() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(true);
  const [alert, setAlert] = useState(null);
  useEffect(() => {
    const lang = i18n.resolvedLanguage;
    fetch(getApiUrl(`/api/alerts?lang=${encodeURIComponent(lang || "")}`))
      .then((r) => r.json())
      .then((list) => {
        const active = list.find((a) => a.active);
        if (active) {
          setAlert(active);
          setOpen(true);
        }
      });
  }, [i18n.resolvedLanguage]);
  if (!open || !alert) return null;
  const level = alert.level || "info";
  return (
    <div className="container mx-auto px-4 mt-3">
      <div
        className={`${
          level === "warning"
            ? "bg-yellow-50 border-yellow-200"
            : level === "danger"
            ? "bg-red-50 border-red-200"
            : "bg-gray-50 border-gray-200"
        } rounded-md border p-4 flex items-start gap-3`}
      >
        {alert.attachmentType === "image" && alert.attachmentUrl && (
          <img
            src={alert.attachmentUrl}
            alt="alert"
            className="max-h-16 rounded"
          />
        )}
        <div className="flex-1 text-gray-800">
          <div className="font-semibold mb-1">{t("alert.important")}</div>
          <div>{alert.message}</div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Dismiss alert"
        >
          <i className="fa-solid fa-times" />
        </button>
      </div>
    </div>
  );
}
