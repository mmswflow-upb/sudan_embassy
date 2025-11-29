import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getApiUrl } from "../config.js";

function StatusCard({ color, icon, title, subtitle }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
      <div className={`${color} text-white rounded-full p-3 me-4`}>
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
  const { t, i18n } = useTranslation();
  const [statusBar, setStatusBar] = useState(null);

  useEffect(() => {
    fetch(getApiUrl(`/api/settings?lang=${i18n.language}`))
      .then((r) => r.json())
      .then((s) => {
        console.log('StatusBar received settings:', s);
        if (s?.statusBar) {
          console.log('StatusBar data:', s.statusBar);
          setStatusBar(s.statusBar);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch settings:', err);
      });
  }, [i18n.language]);

  if (!statusBar) return null;

  const cards = [
    {
      color: "bg-sudan-green",
      icon: "fa-solid fa-clock",
      title: t("status.embassy_status"),
      subtitle: statusBar.status
    },
    {
      color: "bg-sudan-blue",
      icon: "fa-solid fa-bell",
      title: t("status.holiday_notice"),
      subtitle: statusBar.holiday
    },
    {
      color: "bg-sudan-black",
      icon: "fa-solid fa-calendar-alt",
      title: t("status.next_available"),
      subtitle: statusBar.nextAppointment
    },
  ];

  return (
    <div
      id="status-bar"
      data-aos="fade-up"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6"
    >
      {cards.map((c, i) => (
        <div key={i} data-aos="zoom-in" data-aos-delay={i * 70}>
          <StatusCard {...c} />
        </div>
      ))}
    </div>
  );
}
