import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

let slides = [];

// Allow admin to configure slides via settings if present
function useSlides() {
  const { t } = useTranslation();
  const [state, setState] = useState([
    {
      title: t("promo.meroe_title"),
      subtitle: t("promo.meroe_subtitle"),
      cta: t("promo.cta"),
      href: "https://artsexperiments.withgoogle.com/meroe/",
      image: "/images/1ss.jpg",
    },
    {
      title: t("promo.police_title"),
      subtitle: t("promo.police_subtitle"),
      cta: t("promo.cta"),
      href: "https://www.sudanpolice.net/",
      image: "/images/2ss.jpg",
    },
  ]);
  useEffect(() => {
    fetch(getApiUrl("/api/settings"))
      .then((r) => r.json())
      .then((s) => {
        if (
          s?.promoSlides &&
          Array.isArray(s.promoSlides) &&
          s.promoSlides.length
        )
          setState(s.promoSlides);
      })
      .catch(() => {});
  }, []);
  return state;
}

export default function PromoCarousel() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  slides = useSlides();
  useEffect(() => {
    const id = setInterval(
      () => setActive((a) => (a + 1) % slides.length),
      7000
    );
    return () => clearInterval(id);
  }, []);
  return (
    <section className="my-6">
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg"
        style={{ height: "360px" }}
      >
        {slides.map((s, idx) => (
          <div
            key={s.title}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === active ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={idx !== active}
          >
            <img
              src={s.image}
              alt="promo"
              className="w-full h-full object-cover kenburns"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h3 className="text-white text-2xl md:text-4xl font-bold mb-3 max-w-5xl">
                {s.title}
              </h3>
              <p className="text-white/90 max-w-4xl mb-4 hidden md:block">
                {s.subtitle}
              </p>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="ripple bg-sudan-green hover:bg-green-700 text-white px-6 py-3 rounded font-medium"
              >
                {s.cta || t("common.view_all")}
              </a>
            </div>
          </div>
        ))}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2.5 h-2.5 rounded-full ${
                i === active ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
