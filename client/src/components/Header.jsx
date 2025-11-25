import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef(null);
  const [contact, setContact] = useState({
    phone: "+40 21 123 4567",
    email: "info@sudanembassy.ro",
  });
  useEffect(() => {
    fetch(getApiUrl("/api/settings"))
      .then((r) => r.json())
      .then((s) => {
        if (s?.header)
          setContact({
            phone: s.header.phone || contact.phone,
            email: s.header.email || contact.email,
          });
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    function onDocClick(e) {
      if (!aboutRef.current) return;
      if (!aboutRef.current.contains(e.target)) setAboutOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="header"
      className={`header ${
        scrolled ? "is-scrolled" : ""
      } bg-gradient-to-r from-[#0b7a34] via-[#0a6b47] to-[#0033A0] text-white rounded-b-xl sticky top-0 z-40`}
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-1 md:gap-2 py-2 px-3 md:px-4 border-b border-white/20 text-[11px] md:text-sm">
          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center hover:text-gray-200"
            >
              <i className="fa-solid fa-phone w-4" />
              <span className="ml-2">{contact.phone}</span>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center hover:text-gray-200"
            >
              <i className="fa-solid fa-envelope w-4" />
              <span className="ml-2 truncate max-w-[180px] md:max-w-none">
                {contact.email}
              </span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => i18n.changeLanguage("en")}
              className={`px-2 py-1 rounded-full text-xs bg-white/10 hover:bg-white/20 ${
                i18n.resolvedLanguage === "en" ? "ring-2 ring-sudan-red" : ""
              }`}
            >
              {t("common.language.en")}
            </button>
            <button
              onClick={() => i18n.changeLanguage("ro")}
              className={`px-2 py-1 rounded-full text-xs bg-white/10 hover:bg-white/20 ${
                i18n.resolvedLanguage === "ro" ? "ring-2 ring-sudan-red" : ""
              }`}
            >
              {t("common.language.ro")}
            </button>
            <button
              onClick={() => i18n.changeLanguage("ar")}
              className={`px-2 py-1 rounded-full text-xs bg-white/10 hover:bg-white/20 font-arabic ${
                i18n.resolvedLanguage === "ar" ? "ring-2 ring-sudan-red" : ""
              }`}
            >
              {t("common.language.ar")}
            </button>
            <div className="flex items-center gap-2 ml-4">
              <span className="hover:text-gray-200 cursor-pointer">
                <i className="fa-brands fa-facebook-f" />
              </span>
              <span className="hover:text-gray-200 cursor-pointer">
                <i className="fa-brands fa-twitter" />
              </span>
              <span className="hover:text-gray-200 cursor-pointer">
                <i className="fa-brands fa-instagram" />
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center py-3 px-3 md:px-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-sudan-green">
              <i className="fa-solid fa-landmark text-lg" />
            </div>
            <div>
              <div className="font-medium text-white text-lg">
                {t("footer.embassy")}
              </div>
              <div className="text-xs text-white/80">{t("hero.subtitle")}</div>
            </div>
          </div>

          <nav className="hidden md:flex">
            <ul className="flex gap-2 md:gap-3">
              <li className="relative group">
                <NavLink
                  to="/"
                  className="px-3 py-2 rounded-md flex items-center font-medium cursor-pointer hover:bg-white/10 transition-colors"
                >
                  {t("nav.home")}
                </NavLink>
              </li>
              <li className="relative group">
                <NavLink
                  to="/consular-services"
                  className="px-3 py-2 rounded-md flex items-center font-medium cursor-pointer hover:bg-white/10 transition-colors"
                >
                  {t("nav.consular")}
                </NavLink>
              </li>
              <li className="relative group">
                <NavLink
                  to="/appointments"
                  className="px-3 py-2 rounded-md flex items-center font-medium cursor-pointer hover:bg-white/10 transition-colors"
                >
                  {t("nav.appointments")}
                </NavLink>
              </li>
              <li className="relative group">
                <NavLink
                  to="/news"
                  className="px-3 py-2 rounded-md flex items-center font-medium cursor-pointer hover:bg-white/10 transition-colors"
                >
                  {t("nav.news")}
                </NavLink>
              </li>
              <li className="relative" ref={aboutRef}>
                <button
                  type="button"
                  className="px-3 py-2 rounded-md flex items-center font-medium cursor-pointer select-none hover:bg-white/10 transition-colors"
                  onClick={() => setAboutOpen((v) => !v)}
                >
                  <span>{t("nav.about")}</span>
                  <svg
                    className={`ml-2 w-3.5 h-3.5 transition-transform ${
                      aboutOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
                  </svg>
                </button>
                {aboutOpen && (
                  <div className="absolute left-0 top-full pt-2 z-50">
                    <div className="w-64 bg-white text-sudan-black rounded-md shadow-xl py-2">
                      <NavLink
                        onClick={() => setAboutOpen(false)}
                        to="/about-sudan"
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        {t("nav.overview")}
                      </NavLink>
                      <NavLink
                        onClick={() => setAboutOpen(false)}
                        to="/about/in-brief"
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        {t("nav.about_brief")}
                      </NavLink>
                      <NavLink
                        onClick={() => setAboutOpen(false)}
                        to="/about/travel"
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        {t("nav.about_travel")}
                      </NavLink>
                      <NavLink
                        onClick={() => setAboutOpen(false)}
                        to="/about/culture"
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        {t("nav.about_culture")}
                      </NavLink>
                      <NavLink
                        onClick={() => setAboutOpen(false)}
                        to="/about/tourism"
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        {t("nav.about_tourism")}
                      </NavLink>
                      <NavLink
                        onClick={() => setAboutOpen(false)}
                        to="/about/visiting"
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        {t("nav.about_visiting")}
                      </NavLink>
                    </div>
                  </div>
                )}
              </li>
              <li className="relative group">
                <NavLink
                  to="/contact"
                  className="px-3 py-2 rounded-md flex items-center font-medium cursor-pointer hover:bg-white/10 transition-colors"
                >
                  {t("nav.contact")}
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              to="/appointments"
              className="bg-sudan-black hover:bg-gray-800 text-white px-3 md:px-4 py-2 rounded-lg shadow-lg flex items-center w-full md:w-auto text-sm md:text-base transition-transform hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-calendar-check mr-2" />
              {t("nav.book_appointment")}
            </Link>
            <button
              className="md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <i className="fa-solid fa-bars text-white text-xl" />
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden px-3 md:px-4 pb-4">
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink
                  onClick={() => setOpen(false)}
                  to="/"
                  className="block py-2"
                >
                  {t("nav.home")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setOpen(false)}
                  to="/consular-services"
                  className="block py-2"
                >
                  {t("nav.consular")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setOpen(false)}
                  to="/appointments"
                  className="block py-2"
                >
                  {t("nav.appointments")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setOpen(false)}
                  to="/news"
                  className="block py-2"
                >
                  {t("nav.news")}
                </NavLink>
              </li>
              <li>
                <details className="py-2">
                  <summary className="cursor-pointer select-none">
                    {t("nav.about")}
                  </summary>
                  <ul className="mt-2 pl-4 space-y-2">
                    <li>
                      <NavLink
                        onClick={() => setOpen(false)}
                        to="/about-sudan"
                        className="block"
                      >
                        {t("nav.overview")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => setOpen(false)}
                        to="/about/in-brief"
                        className="block"
                      >
                        {t("nav.about_brief")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => setOpen(false)}
                        to="/about/travel"
                        className="block"
                      >
                        {t("nav.about_travel")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => setOpen(false)}
                        to="/about/culture"
                        className="block"
                      >
                        {t("nav.about_culture")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => setOpen(false)}
                        to="/about/tourism"
                        className="block"
                      >
                        {t("nav.about_tourism")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => setOpen(false)}
                        to="/about/visiting"
                        className="block"
                      >
                        {t("nav.about_visiting")}
                      </NavLink>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <NavLink
                  onClick={() => setOpen(false)}
                  to="/contact"
                  className="block py-2"
                >
                  {t("nav.contact")}
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
