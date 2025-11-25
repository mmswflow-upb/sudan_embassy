import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

import { Link } from "react-router-dom";

function NewsCard({
  id,
  tagColor,
  tagLabel,
  date,
  title,
  summary,
  image,
  alt,
}) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="h-48 bg-gray-200 relative">
        <img className="w-full h-full object-cover" src={image} alt={alt} />
        <div
          className={`${tagColor} text-white text-xs px-2 py-1 rounded absolute top-2 left-2`}
        >
          {tagLabel}
        </div>
      </div>
      <div className="p-4">
        <span className="text-xs text-gray-500">{date}</span>
        <h3 className="text-lg font-medium my-2">{title}</h3>
        <p className="text-gray-600 mb-3">{summary}</p>
        <Link
          to={`/news/${id}`}
          className="text-sudan-blue hover:underline flex items-center cursor-pointer"
        >
          {t("news.read_more")} <i className="fa-solid fa-arrow-right ml-2" />
        </Link>
      </div>
    </div>
  );
}

export default function News({ limit }) {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const lang = i18n.resolvedLanguage;
    fetch(getApiUrl(`/api/news?lang=${encodeURIComponent(lang || "")}`))
      .then((r) => r.json())
      .then((list) => {
        setPosts(
          list.map((n) => ({
            id: n.id,
            tagColor:
              (n.tag || "").toLowerCase() === "official"
                ? "bg-sudan-green"
                : "bg-sudan-blue",
            tagLabel: n.tag || t("news.tag_update", "Update"),
            date: new Date(n.createdAt).toLocaleDateString(),
            title: n.title,
            summary: n.summary,
            image: n.image,
            alt: n.title,
          }))
        );
      });
  }, [i18n.resolvedLanguage]);

  const list = typeof limit === "number" ? posts.slice(0, limit) : posts;
  return (
    <section id="news-section" data-aos="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-2xl font-bold text-sudan-black sudan-section-title">
          {t("news.title")}
        </h2>
        <a
          href="/news"
          className="text-sudan-blue hover:underline cursor-pointer"
        >
          {t("common.view_all")}
        </a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
        {list.map((p, idx) => (
          <div
            key={p.id || p.title}
            className="card overflow-hidden"
            data-aos="fade-up"
            data-aos-delay={idx * 90}
          >
            <NewsCard {...p} />
          </div>
        ))}
      </div>
      {typeof limit === "number" && posts.length > limit && (
        <div className="flex justify-center">
          <a
            href="/news"
            className="text-sudan-blue hover:underline cursor-pointer"
          >
            {t("common.view_all")}
          </a>
        </div>
      )}
    </section>
  );
}
