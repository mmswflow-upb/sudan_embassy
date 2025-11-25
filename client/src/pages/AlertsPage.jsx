import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

export default function AlertsPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch(getApiUrl("/api/alerts"))
      .then((r) => r.json())
      .then(setItems);
  }, []);
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-sudan-black mb-4">
        {t("pages.alerts")}
      </h1>
      <div className="space-y-4">
        {items.map((a) => (
          <div
            key={a.id}
            className={`${
              a.level === "warning"
                ? "bg-yellow-50 border border-yellow-200"
                : a.level === "danger"
                ? "bg-red-50 border border-red-200"
                : "bg-gray-50 border border-gray-200"
            } rounded p-4`}
          >
            {a.attachmentType === "image" && a.attachmentUrl && (
              <img
                src={a.attachmentUrl}
                alt="alert"
                className="max-h-64 rounded mb-3"
              />
            )}
            {a.attachmentType === "pdf" && a.attachmentUrl && (
              <iframe
                title="alert"
                src={`${a.attachmentUrl}#toolbar=1`}
                className="w-full h-[360px] rounded mb-3"
              />
            )}
            <p className="text-gray-800">{a.message}</p>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-gray-500">{t("pages.no_alerts")}</div>
        )}
      </div>
    </main>
  );
}
