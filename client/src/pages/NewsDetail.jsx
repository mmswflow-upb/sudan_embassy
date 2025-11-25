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
    <main className="container mx-auto px-4 py-10">
      <Link to="/news" className="text-sudan-blue">
        {t("news.back")}
      </Link>
      <article className="bg-white rounded-lg shadow-sm p-6 mt-4 space-y-4">
        <header>
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(item.createdAt).toLocaleString()}
          </div>
        </header>
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="w-full max-w-3xl rounded"
          />
        )}
        <p className="text-gray-700 whitespace-pre-line">{item.summary}</p>
      </article>
    </main>
  );
}
