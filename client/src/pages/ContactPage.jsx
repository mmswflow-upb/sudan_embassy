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
    <main className="container mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-sudan-black mb-2 md:mb-3 text-center">
        {t("contact.title")}
      </h1>
      <p className="text-center text-sm md:text-base text-gray-600 mb-6 md:mb-8">{t("hero.paragraph")}</p>
      <div className="max-w-3xl mx-auto">
        <div className="card p-5 md:p-8 space-y-3 md:space-y-4">
          <a
            href="https://www.google.com/maps/place/Ambasada+Republicii+Sudan/@44.447707,26.1031946,17.77z/data=!4m6!3m5!1s0x40b1ff8fd7ba51a9:0x1bea18766dc4de4c!8m2!3d44.4467127!4d26.1035968!16s%2Fg%2F11vbypp9cb?entry=ttu"
            target="_blank"
            rel="noreferrer"
            className="flex items-start text-sudan-blue hover:underline"
          >
            <i className="fa-solid fa-location-dot w-6 text-sudan-green mt-1" />
            <span className="ms-3 leading-relaxed">{contact.address}</span>
          </a>
          <a
            href={`tel:${contact.phone}`}
            className="bg-sudan-green hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-phone" />
            <span>{contact.phone}</span>
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="bg-sudan-blue hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-envelope" />
            <span>{contact.email}</span>
          </a>
        </div>
      </div>
    </main>
  );
}
