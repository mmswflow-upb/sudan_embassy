import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

function ServiceCard({ color, icon, title, desc }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
      <div
        className={`${color} text-white rounded-full h-12 w-12 flex items-center justify-center mb-4`}
      >
        <i className={icon + " text-xl"} />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{desc}</p>
      <a
        href="/consular-services"
        className="text-sudan-blue hover:underline flex items-center cursor-pointer"
      >
        {t("common.learn_more")}
        <i className="fa-solid fa-arrow-right ml-2" />
      </a>
    </div>
  );
}

export default function Services({ limit, carousel = false }) {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  useEffect(() => {
    const lang = i18n.resolvedLanguage;
    fetch(
      getApiUrl(`/api/consular-services?lang=${encodeURIComponent(lang || "")}`)
    )
      .then((r) => r.json())
      .then((list) => {
        setServices(
          list.map((s) => ({
            color: s.icon?.includes("black")
              ? "bg-sudan-black"
              : s.icon?.includes("blue")
              ? "bg-sudan-blue"
              : "bg-sudan-green",
            icon: s.icon || "fa-solid fa-passport",
            title: s.name,
            desc: s.details,
            image: s.image,
          }))
        );
      });
  }, [i18n.resolvedLanguage]);

  const list = typeof limit === "number" ? services.slice(0, limit) : services;
  if (carousel) {
    return (
      <section id="services-section" data-aos="fade-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-sudan-black sudan-section-title">
            {t("services.title")}
          </h2>
          <a
            href="/consular-services"
            className="text-sudan-blue hover:underline"
          >
            {t("common.view_all")}
          </a>
        </div>
        <div className="overflow-x-auto -mx-4 px-4 snap-x">
          <div className="grid grid-flow-col auto-cols-[minmax(300px,1fr)] gap-4 md:gap-6 mb-4">
            {list.map((s, idx) => (
              <div
                key={s.title}
                className="min-w-[300px] snap-start"
                data-aos="fade-up"
                data-aos-delay={idx * 80}
              >
                <div className="card">
                  <ServiceCard {...s} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="services-section" data-aos="fade-up">
      <h2 className="text-2xl font-bold text-sudan-black mb-4 sudan-section-title">
        {t("services.title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {list.map((s, idx) => (
          <div key={s.title} data-aos="fade-up" data-aos-delay={idx * 80}>
            <div className="card">
              <ServiceCard {...s} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
