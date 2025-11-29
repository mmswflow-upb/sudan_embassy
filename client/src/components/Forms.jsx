import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

function FormRow({ color, title, meta, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="border border-gray-200 rounded-md p-3 md:p-4 flex items-center hover:bg-gray-50"
    >
      <div
        className={`${color} text-white rounded-full h-10 w-10 flex items-center justify-center me-4`}
      >
        <i className="fa-solid fa-file-pdf" />
      </div>
      <div className="flex-grow">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-600">{meta}</p>
      </div>
      <span className="text-sudan-blue hover:text-blue-700 cursor-pointer">
        <i className="fa-solid fa-download" />
      </span>
    </a>
  );
}

export default function Forms({ limit }) {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  useEffect(() => {
    const lang = i18n.resolvedLanguage;
    fetch(getApiUrl(`/api/forms?lang=${encodeURIComponent(lang || "")}`))
      .then((r) => r.json())
      .then((list) => {
        const rows = list.map((f) => ({
          color: "bg-sudan-green",
          title: f.title,
          meta: f.description || `${(f.fileType || "PDF").toUpperCase()}`,
          url: f.fileUrl,
        }));
        setData(rows);
      });
  }, [i18n.resolvedLanguage]);
  return (
    <section id="forms-section" data-aos="fade-up">
      <h2 className="text-2xl font-bold text-sudan-black mb-4 sudan-section-title">
        {t("forms.title")}
      </h2>
      <div className="card p-4 md:p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {(typeof limit === "number" ? data.slice(0, limit) : data).map(
            (r) => (
              <FormRow
                key={r.title}
                color={r.color}
                title={r.title}
                meta={r.meta}
                url={r.url}
              />
            )
          )}
        </div>
        <div className="mt-4 text-center">
          <a
            href="/forms"
            className="text-sudan-blue hover:underline cursor-pointer"
          >
            {t("forms.view_all")}
          </a>
        </div>
      </div>
    </section>
  );
}
