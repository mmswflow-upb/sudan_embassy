import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

function Hours() {
  const { t } = useTranslation();
  const [hours, setHours] = useState({
    monThu: "9:00 AM - 4:00 PM",
    fri: "9:00 AM - 1:00 PM",
  });
  useEffect(() => {
    fetch(getApiUrl("/api/settings"))
      .then((r) => r.json())
      .then((s) => {
        if (s?.hours) setHours(s.hours);
      });
  }, []);
  return (
    <div className="rounded-lg shadow-sm p-6 bg-gradient-to-br from-sudan-green to-[#0a6b47] text-white">
      <h3 className="text-xl font-medium mb-4">{t("contact.embassy_hours")}</h3>
      <ul className="space-y-2">
        <li className="flex justify-between">
          <span>{t("contact.mon_thu")}</span>
          <span>{hours.monThu}</span>
        </li>
        <li className="flex justify-between">
          <span>{t("contact.fri")}</span>
          <span>{hours.fri}</span>
        </li>
        <li className="flex justify-between">
          <span>{t("contact.sat_sun")}</span>
          <span>{t("contact.closed")}</span>
        </li>
      </ul>
      <div className="mt-4 pt-4 border-t border-white/30">
        <h4 className="font-medium mb-2">{t("contact.consular_section")}</h4>
        <p>{t("contact.applications_accepted")}</p>
        <p>{t("contact.document_collection")}</p>
      </div>
    </div>
  );
}

function Contacts() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([
    [
      "fa-solid fa-location-dot",
      "123 Diplomatic Street, Sector 1, Bucharest, Romania",
    ],
    ["fa-solid fa-phone", "+40 21 123 4567"],
    ["fa-solid fa-fax", "+40 21 123 4568"],
    ["fa-solid fa-envelope", "consular@sudanembassy.ro"],
    ["fa-solid fa-envelope", "info@sudanembassy.ro"],
  ]);
  useEffect(() => {
    fetch(getApiUrl("/api/settings"))
      .then((r) => r.json())
      .then((s) => {
        if (s?.contacts) setRows(s.contacts);
      });
  }, []);
  return (
    <div className="card p-6">
      <h3 className="text-xl font-medium mb-4">{t("contact.info")}</h3>
      <div className="space-y-3">
        {rows.map(([icon, text]) => (
          <div key={icon + text} className="flex items-start">
            <i className={`${icon} w-5 text-sudan-green mt-1`} />
            <span className="ml-2">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Emergency() {
  const { t } = useTranslation();
  const [emergency, setEmergency] = useState({
    phone: "+40 722 123 456",
    note: "This number is for genuine emergencies only",
  });
  useEffect(() => {
    fetch(getApiUrl("/api/settings"))
      .then((r) => r.json())
      .then((s) => {
        if (s?.emergency) setEmergency(s.emergency);
      });
  }, []);
  return (
    <div className="bg-sudan-black text-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-medium mb-4">{t("contact.emergency")}</h3>
      <p className="mb-4">{t("contact.emergency_outside")}</p>
      <div className="bg-white/10 rounded-md p-4 mb-4">
        <div className="flex items-center mb-2">
          <i className="fa-solid fa-phone-volume w-5" />
          <span className="ml-2">{emergency.phone}</span>
        </div>
        <p className="text-sm text-white/80">{emergency.note}</p>
      </div>
      <span className="bg-sudan-blue text-white hover:bg-blue-800 px-4 py-2 rounded-md font-medium flex items-center justify-center w-full cursor-pointer">
        <i className="fa-solid fa-info-circle mr-2" />
        {t("contact.emergency_guidelines")}
      </span>
    </div>
  );
}

export default function InfoGrids() {
  return (
    <section id="info-section" data-aos="fade-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Hours />
        <Contacts />
        <Emergency />
      </div>
    </section>
  );
}
