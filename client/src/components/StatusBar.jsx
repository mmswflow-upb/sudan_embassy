import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const cards = [
    {
      color: "bg-sudan-green",
      icon: "fa-solid fa-clock",
      title: t("status.embassy_status"),
      subtitle: t("settings.statusBar.status")
    },
    {
      color: "bg-sudan-blue",
      icon: "fa-solid fa-bell",
      title: t("status.holiday_notice"),
      subtitle: t("settings.statusBar.holiday")
    },
    {
      color: "bg-sudan-black",
      icon: "fa-solid fa-calendar-alt",
      title: t("status.next_available"),
      subtitle: t("settings.statusBar.nextAppointment")
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
