import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

export default function ContactPage() {
  const { t } = useTranslation();
  const [contact, setContact] = useState({
    address: "123 Diplomatic Street, Sector 1, Bucharest, Romania",
    phone: "+40 21 123 4567",
    email: "info@sudanembassy.ro",
  });
  useEffect(() => {
    fetch(getApiUrl("/api/settings"))
      .then((r) => r.json())
      .then((s) => {
        const address = s?.address || contact.address;
        const phone = s?.header?.phone || contact.phone;
        const email = s?.header?.email || contact.email;
        setContact({ address, phone, email });
      })
      .catch(() => {});
  }, []);
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-sudan-black mb-3 text-center">
        {t("contact.title")}
      </h1>
      <p className="text-center text-gray-600 mb-8">{t("hero.paragraph")}</p>
      <div className="max-w-3xl mx-auto">
        <div className="card p-6 md:p-8 space-y-4">
          <div className="flex items-start">
            <i className="fa-solid fa-location-dot w-6 text-sudan-green mt-1" />
            <span className="ml-3 leading-relaxed">{contact.address}</span>
          </div>
          <div className="flex items-center">
            <i className="fa-solid fa-phone w-6 text-sudan-green" />
            <a
              className="ml-3 text-sudan-blue hover:underline"
              href={`tel:${contact.phone}`}
            >
              {contact.phone}
            </a>
          </div>
          <div className="flex items-center">
            <i className="fa-solid fa-envelope w-6 text-sudan-green" />
            <a
              className="ml-3 text-sudan-blue hover:underline"
              href={`mailto:${contact.email}`}
            >
              {contact.email}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
