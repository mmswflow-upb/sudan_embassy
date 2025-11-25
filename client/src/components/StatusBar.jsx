import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

function StatusCard({ color, icon, title, subtitle }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
      <div className={`${color} text-white rounded-full p-3 mr-4`}>
        <i className={icon} />
      </div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-gray-600">{subtitle}</div>
      </div>
    </div>
  );
}

export default function StatusBar() {
  const { t } = useTranslation();
  const [cards, setCards] = useState([
    { color: "bg-sudan-green", icon: "fa-solid fa-clock", subtitle: "" },
    { color: "bg-sudan-blue", icon: "fa-solid fa-bell", subtitle: "—" },
    {
      color: "bg-sudan-black",
      icon: "fa-solid fa-calendar-alt",
      subtitle: "—",
    },
  ]);
  useEffect(() => {
    fetch(getApiUrl("/api/settings"))
      .then((r) => r.json())
      .then((s) => {
        if (!s) return;
        const updated = [...cards];
        if (s.statusBar?.status) updated[0].subtitle = s.statusBar.status;
        if (s.statusBar?.holiday) updated[1].subtitle = s.statusBar.holiday;
        if (s.statusBar?.nextAppointment)
          updated[2].subtitle = s.statusBar.nextAppointment;
        setCards(updated);
      })
      .catch(() => {});
  }, []);
  return (
    <div
      id="status-bar"
      data-aos="fade-up"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6"
    >
      {cards.map((c, i) => (
        <div key={i} data-aos="zoom-in" data-aos-delay={i * 70}>
          <StatusCard
            {...c}
            title={
              i === 0
                ? t("status.embassy_status")
                : i === 1
                ? t("status.holiday_notice")
                : t("status.next_available")
            }
          />
        </div>
      ))}
    </div>
  );
}
