import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

export default function ConsularPage() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  useEffect(() => {
    const lang = i18n.resolvedLanguage;
    fetch(
      getApiUrl(`/api/consular-services?lang=${encodeURIComponent(lang || "")}`)
    )
      .then((r) => r.json())
      .then(setItems);
  }, [i18n.resolvedLanguage]);
  return (
    <main className="container mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-sudan-black mb-4 md:mb-6">
        {t("pages.consular_services")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-lg shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <i className={`${s.icon} text-sudan-green text-lg md:text-xl`} />
              <h3 className="text-base md:text-lg font-medium">{s.name}</h3>
            </div>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-3">{s.details}</p>
            <Link
              to={`/consular/${s.id}`}
              className="text-sudan-blue hover:underline"
            >
              {t("pages.learn_more")}
            </Link>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-gray-500">{t("pages.no_services")}</div>
        )}
      </div>
    </main>
  );
}
