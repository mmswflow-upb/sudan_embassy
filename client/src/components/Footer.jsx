import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

export default function Footer() {
  const { t } = useTranslation();
  const [contact, setContact] = useState({
    address: "123 Diplomatic Street, Sector 1\nBucharest, Romania",
    phone: "+40 21 123 4567",
    email: "info@sudanembassy.ro",
  });
  useEffect(() => {
    fetch(getApiUrl("/api/settings"))
      .then((r) => r.json())
      .then((s) => {
        if (!s) return;
        const address = s.address || contact.address;
        const phone = s.header?.phone || contact.phone;
        const email = s.header?.email || contact.email;
        setContact({ address, phone, email });
      })
      .catch(() => {});
  }, []);

  return (
    <footer id="footer" className="bg-sudan-black text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-xl mx-auto text-center space-y-3">
          <h3 className="text-xl font-semibold tracking-tight">
            {t("footer.embassy")}
          </h3>
          <p className="whitespace-pre-line leading-relaxed opacity-90">
            {contact.address}
          </p>
          <div className="flex items-center justify-center opacity-95">
            <i className="fa-solid fa-phone w-5" />
            <span className="ml-2">{contact.phone}</span>
          </div>
          <div className="flex items-center justify-center opacity-95">
            <i className="fa-solid fa-envelope w-5" />
            <span className="ml-2">{contact.email}</span>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-90">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
