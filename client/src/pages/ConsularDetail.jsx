import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

export default function ConsularDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [item, setItem] = useState(null);
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
    <main className="container mx-auto px-4 py-6 md:py-10">
      <Link to="/consular-services" className="text-sudan-blue text-sm md:text-base inline-flex items-center mb-3">
        <i className="fa-solid fa-arrow-left me-2"></i> {t("pages.consular_services")}
      </Link>
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mt-2">
        <div className="flex items-center gap-2 md:gap-3 mb-3">
          <i className={`${item.icon} text-sudan-green text-lg md:text-xl`} />
          <h1 className="text-xl md:text-2xl font-bold">{item.name}</h1>
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
              className="w-full h-[360px] md:h-[480px] border rounded"
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
            <i className="fa-solid fa-download me-2" /> {t("common.download")}{" "}
            {item.fileName || "file"}
          </a>
        )}
        <p className="text-gray-700 whitespace-pre-line mb-6">{item.details}</p>
      </div>
    </main>
  );
}
