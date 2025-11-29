import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

export default function Hero() {
  const { t } = useTranslation();
  // Prefer translations by default; allow backend settings to override when provided
  const [hero, setHero] = useState({
    title: "",
    subtitle: "",
    cta1: "",
    cta2: "",
  });
  useEffect(() => {
    fetch(getApiUrl("/api/settings"))
      .then((r) => r.json())
      .then((s) => {
        if (s?.hero) setHero((prev) => ({ ...prev, ...s.hero }));
      });
  }, []);
  useEffect(() => {
    const handleParallax = () => {
      const el = document.getElementById("hero-banner");
      if (!el) return;
      const offset = window.scrollY * 0.25;
      el.style.backgroundPosition = `center calc(50% + ${offset}px)`;
    };
    window.addEventListener("scroll", handleParallax);
    return () => window.removeEventListener("scroll", handleParallax);
  }, []);
  return (
    <div
      id="hero-banner"
      data-aos="fade-up"
      className="bg-gradient-to-r from-sudan-green via-[#0a6b47] to-sudan-blue rounded-2xl shadow-xl overflow-hidden mb-8 relative min-h-[360px] md:min-h-[460px]"
    >
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-sudan-blue/40 rounded-full bg-blob" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sudan-green/40 rounded-full bg-blob" />
      <div className="absolute inset-0 bg-black opacity-30" />
      <div className="relative z-10 flex h-full items-stretch">
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 md:mb-4 leading-tight">
            {hero.title || t("hero.title")}
          </h1>
          <h2 className="text-lg md:text-2xl text-white/90 mb-4 md:mb-6">
            {hero.subtitle || t("hero.subtitle")}
          </h2>
          <p className="text-sm md:text-base text-white mb-6 md:mb-8">{t("hero.paragraph")}</p>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4">
            <Link
              to="/appointments"
              className="ripple bg-white text-sudan-green hover:bg-gray-100 px-5 py-2.5 md:px-6 md:py-3 rounded-md font-medium flex items-center cursor-pointer w-full sm:w-auto justify-center text-sm md:text-base"
            >
              <i className="fa-solid fa-calendar-check me-2" />
              {hero.cta1 || t("hero.cta1")}
            </Link>
            <Link
              to="/consular-services"
              className="ripple bg-sudan-black text-white hover:bg-gray-800 px-5 py-2.5 md:px-6 md:py-3 rounded-md font-medium flex items-center cursor-pointer w-full sm:w-auto justify-center text-sm md:text-base"
            >
              <i className="fa-solid fa-passport me-2" />
              {hero.cta2 || t("hero.cta2")}
            </Link>
          </div>
        </div>
        <div className="hidden md:flex w-1/2 items-center justify-center p-4 md:p-8">
          {/* Stylized Sudan flag card */}
          <style>{`
            @keyframes floatSlow { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-10px) } }
            @keyframes wave {
              0% { transform: skewX(0deg) }
              50% { transform: skewX(2deg) }
              100% { transform: skewX(0deg) }
            }
          `}</style>
          <div
            className="relative"
            style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.35))" }}
          >
            <div
              className="float-slow"
              style={{ animation: "floatSlow 6s ease-in-out infinite" }}
            >
              <div
                className="glass rounded-xl p-2 rotate-[-6deg] tilt"
                style={{ animation: "wave 5s ease-in-out infinite" }}
              >
                <svg
                  width="360"
                  height="220"
                  viewBox="0 0 360 220"
                  className="rounded-lg overflow-hidden"
                >
                  <rect x="0" y="0" width="360" height="73.33" fill="#D21034" />
                  <rect
                    x="0"
                    y="73.33"
                    width="360"
                    height="73.33"
                    fill="#FFFFFF"
                  />
                  <rect
                    x="0"
                    y="146.66"
                    width="360"
                    height="73.34"
                    fill="#000000"
                  />
                  <polygon points="0,0 0,220 140,110" fill="#007229" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
