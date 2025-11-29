import { useTranslation } from "react-i18next";

function Hours() {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg shadow-sm p-6 bg-gradient-to-br from-sudan-green to-[#0a6b47] text-white">
      <h3 className="text-xl font-medium mb-4">{t("contact.embassy_hours")}</h3>
      <ul className="space-y-2">
        <li className="flex justify-between">
          <span>{t("contact.mon_thu")}</span>
          <span>{t("settings.hours.monThu")}</span>
        </li>
        <li className="flex justify-between">
          <span>{t("contact.fri")}</span>
          <span>{t("settings.hours.fri")}</span>
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
  const rows = t("settings.contacts", { returnObjects: true });
  return (
    <div className="card p-6">
      <h3 className="text-xl font-medium mb-4">{t("contact.info")}</h3>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.icon + row.text} className="flex items-start">
            <i className={`${row.icon} w-5 text-sudan-green mt-1`} />
            <span className="ms-2">{row.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Emergency() {
  const { t } = useTranslation();
  const emergency = t("settings.emergency", { returnObjects: true });
  return (
    <div className="bg-sudan-black text-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-medium mb-4">{t("contact.emergency")}</h3>
      <p className="mb-4">{t("contact.emergency_outside")}</p>
      <div className="bg-white/10 rounded-md p-4 mb-4">
        <div className="flex items-center mb-2">
          <i className="fa-solid fa-phone-volume w-5" />
          <span className="ms-2">{emergency.phone}</span>
        </div>
        <p className="text-sm text-white/80">{emergency.note}</p>
      </div>
      <span className="bg-sudan-blue text-white hover:bg-blue-800 px-4 py-2 rounded-md font-medium flex items-center justify-center w-full cursor-pointer">
        <i className="fa-solid fa-info-circle me-2" />
        {t("contact.emergency_guidelines")}
      </span>
    </div>
  );
}

export default function InfoGrids() {
  return (
    <section id="info-section" data-aos="fade-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Hours />
        <Contacts />
        <Emergency />
      </div>
    </section>
  );
}
