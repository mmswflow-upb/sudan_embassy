import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

export default function NewsDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  useEffect(() => {
    fetch(getApiUrl(`/api/news/${id}`))
      .then((r) => r.json())
      .then(setItem);
  }, [id]);
  if (!item)
    return (
      <main className="container mx-auto px-4 py-10">
        {t("common.loading")}
      </main>
    );
  return (
    <main className="container mx-auto px-4 py-6 md:py-10">
      <Link to="/news" className="text-sudan-blue text-sm md:text-base inline-flex items-center mb-3">
        <i className="fa-solid fa-arrow-left me-2"></i> {t("news.back")}
      </Link>
      <article className="bg-white rounded-lg shadow-sm p-4 md:p-6 mt-2 space-y-3 md:space-y-4">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold">{item.title}</h1>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(item.createdAt).toLocaleString()}
          </div>
        </header>
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="w-full rounded"
          />
        )}
        <p className="text-sm md:text-base text-gray-700 whitespace-pre-line">{item.summary}</p>
      </article>
    </main>
  );
}
