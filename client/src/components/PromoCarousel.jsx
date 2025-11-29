import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function PromoCarousel() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  // Get slides from locale translations
  const slides = t("settings.promoSlides", { returnObjects: true });

  useEffect(() => {
    const id = setInterval(
      () => setActive((a) => (a + 1) % slides.length),
      7000
    );
    return () => clearInterval(id);
  }, [slides.length]);
  return (
    <section className="my-6">
      <div
        className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg"
        style={{ height: "280px" }}
        data-aos="fade-up"
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
              <h3 className="text-white text-xl md:text-4xl font-bold mb-2 md:mb-3 max-w-5xl leading-tight">
                {s.title}
              </h3>
              <p className="text-white/90 text-sm md:text-base max-w-4xl mb-3 md:mb-4 hidden sm:block line-clamp-2">
                {s.subtitle}
              </p>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="ripple bg-sudan-green hover:bg-green-700 text-white px-5 py-2 md:px-6 md:py-3 rounded font-medium text-sm md:text-base"
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
