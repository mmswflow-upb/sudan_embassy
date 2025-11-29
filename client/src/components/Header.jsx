import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [contact, setContact] = useState(null);

  // Fetch contact info from API
  useEffect(() => {
    fetch(getApiUrl(`/api/settings?lang=${i18n.language}`))
      .then((r) => r.json())
      .then((s) => {
        if (s?.header) {
          setContact(s.header);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch header settings:', err);
      });
  }, [i18n.language]);
  
  // Check if current page is an About page
  const isAboutPage = location.pathname.startsWith("/about");
  
  // Close about dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (!aboutRef.current) return;
      if (!aboutRef.current.contains(e.target)) setAboutOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (!mobileMenuRef.current) return;
      if (!mobileMenuRef.current.contains(e.target) && !e.target.closest('button[aria-label="Toggle menu"]')) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("click", onDocClick);
      return () => document.removeEventListener("click", onDocClick);
    }
  }, [open]);
  
  // Handle scroll - set scrolled state
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
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
            {contact && (
              <>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center hover:text-gray-200"
                >
                  <i className="fa-solid fa-phone w-4" />
                  <span className="ms-2" dir="ltr">{contact.phone}</span>
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center hover:text-gray-200"
                >
                  <i className="fa-solid fa-envelope w-4" />
                  <span className="ms-2 truncate max-w-[180px] md:max-w-none">
                    {contact.email}
                  </span>
                </a>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1.5 md:gap-2">
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
            </div>
            <div className="hidden md:flex items-center gap-2 ml-4">
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

        <div className="flex justify-between items-center py-2 md:py-3 px-3 md:px-4">
          <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity">
            <div className="h-10 w-14 md:h-12 md:w-16 rounded overflow-hidden shadow-md relative">
              {/* Sudan Flag */}
              <div className="absolute inset-0 flex flex-col">
                <div className="h-1/3 bg-[#D21034]"></div>
                <div className="h-1/3 bg-white"></div>
                <div className="h-1/3 bg-black"></div>
              </div>
              <div className="absolute inset-y-0 left-0 w-0 h-0 border-t-[24px] border-t-transparent border-l-[28px] border-l-[#007229] border-b-[24px] border-b-transparent"></div>
            </div>
            <div>
              <div className="font-medium text-white text-sm md:text-lg">
                {t("footer.embassy")}
              </div>
              <div className="text-[10px] md:text-xs text-white/80">{t("hero.subtitle")}</div>
            </div>
          </Link>

          <nav className="hidden md:flex">
            <ul className="flex gap-2 md:gap-3">
              <li className="relative group">
                <NavLink
                  to="/"
                  onClick={() => setAboutOpen(false)}
                  className={({ isActive }) => `px-3 py-2 rounded-md flex items-center font-medium cursor-pointer transition-colors ${
                    isActive ? "bg-white/20 text-white" : "hover:bg-white/10"
                  }`}
                >
                  {t("nav.home")}
                </NavLink>
              </li>
              <li className="relative group">
                <NavLink
                  to="/consular-services"
                  onClick={() => setAboutOpen(false)}
                  className={({ isActive }) => {
                    const isConsularPage = location.pathname.startsWith('/consular');
                    return `px-3 py-2 rounded-md flex items-center font-medium cursor-pointer transition-colors ${
                      isActive || isConsularPage ? "bg-white/20 text-white" : "hover:bg-white/10"
                    }`;
                  }}
                >
                  {t("nav.consular")}
                </NavLink>
              </li>
              <li className="relative group">
                <NavLink
                  to="/appointments"
                  onClick={() => setAboutOpen(false)}
                  className={({ isActive }) => `px-3 py-2 rounded-md flex items-center font-medium cursor-pointer transition-colors ${
                    isActive ? "bg-white/20 text-white" : "hover:bg-white/10"
                  }`}
                >
                  {t("nav.appointments")}
                </NavLink>
              </li>
              <li className="relative group">
                <NavLink
                  to="/news"
                  onClick={() => setAboutOpen(false)}
                  className={({ isActive }) => {
                    const isNewsPage = location.pathname.startsWith('/news');
                    return `px-3 py-2 rounded-md flex items-center font-medium cursor-pointer transition-colors ${
                      isActive || isNewsPage ? "bg-white/20 text-white" : "hover:bg-white/10"
                    }`;
                  }}
                >
                  {t("nav.news")}
                </NavLink>
              </li>
              <li className="relative" ref={aboutRef}>
                <button
                  type="button"
                  className={`px-3 py-2 rounded-md flex items-center font-medium cursor-pointer select-none transition-colors ${
                    isAboutPage ? "bg-white/20 text-white" : "hover:bg-white/10"
                  }`}
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
                  onClick={() => setAboutOpen(false)}
                  className={({ isActive }) => `px-3 py-2 rounded-md flex items-center font-medium cursor-pointer transition-colors ${
                    isActive ? "bg-white/20 text-white" : "hover:bg-white/10"
                  }`}
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
              <i className="fa-solid fa-calendar-check me-2" />
              {t("nav.book_appointment")}
            </Link>
            <button
              className="md:hidden p-2 -mr-2"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((v) => !v);
              }}
              aria-label="Toggle menu"
              type="button"
            >
              <i className="fa-solid fa-bars text-white text-xl" />
            </button>
          </div>
        </div>
        {open && (
          <div ref={mobileMenuRef} className="md:hidden px-3 md:px-4 pb-4">
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink
                  onClick={() => setOpen(false)}
                  to="/"
                  className={({ isActive }) => `block py-2 px-3 rounded-md transition-colors ${isActive ? "bg-white/20 text-white font-medium" : ""}`}
                >
                  {t("nav.home")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setOpen(false)}
                  to="/consular-services"
                  className={({ isActive }) => {
                    const isConsularPage = location.pathname.startsWith('/consular');
                    return `block py-2 px-3 rounded-md transition-colors ${
                      isActive || isConsularPage ? "bg-white/20 text-white font-medium" : ""
                    }`;
                  }}
                >
                  {t("nav.consular")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setOpen(false)}
                  to="/appointments"
                  className={({ isActive }) => `block py-2 px-3 rounded-md transition-colors ${isActive ? "bg-white/20 text-white font-medium" : ""}`}
                >
                  {t("nav.appointments")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setOpen(false)}
                  to="/news"
                  className={({ isActive }) => {
                    const isNewsPage = location.pathname.startsWith('/news');
                    return `block py-2 px-3 rounded-md transition-colors ${
                      isActive || isNewsPage ? "bg-white/20 text-white font-medium" : ""
                    }`;
                  }}
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
                        className={({ isActive }) => `block py-2 px-3 rounded-md transition-colors ${isActive ? "bg-white/20 text-white font-medium" : ""}`}
                      >
                        {t("nav.overview")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => setOpen(false)}
                        to="/about/in-brief"
                        className={({ isActive }) => `block py-2 px-3 rounded-md transition-colors ${isActive ? "bg-white/20 text-white font-medium" : ""}`}
                      >
                        {t("nav.about_brief")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => setOpen(false)}
                        to="/about/travel"
                        className={({ isActive }) => `block py-2 px-3 rounded-md transition-colors ${isActive ? "bg-white/20 text-white font-medium" : ""}`}
                      >
                        {t("nav.about_travel")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => setOpen(false)}
                        to="/about/culture"
                        className={({ isActive }) => `block py-2 px-3 rounded-md transition-colors ${isActive ? "bg-white/20 text-white font-medium" : ""}`}
                      >
                        {t("nav.about_culture")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => setOpen(false)}
                        to="/about/tourism"
                        className={({ isActive }) => `block py-2 px-3 rounded-md transition-colors ${isActive ? "bg-white/20 text-white font-medium" : ""}`}
                      >
                        {t("nav.about_tourism")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => setOpen(false)}
                        to="/about/visiting"
                        className={({ isActive }) => `block py-2 px-3 rounded-md transition-colors ${isActive ? "bg-white/20 text-white font-medium" : ""}`}
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
                  className={({ isActive }) => `block py-2 px-3 rounded-md transition-colors ${isActive ? "bg-white/20 text-white font-medium" : ""}`}
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
