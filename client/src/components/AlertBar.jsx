import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config.js";

export default function AlertBar() {
  const { t, i18n } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    const lang = i18n.resolvedLanguage;
    fetch(getApiUrl(`/api/alerts?lang=${encodeURIComponent(lang || "")}`))
      .then((r) => r.json())
      .then((list) => {
        // Get all active alerts
        const activeAlerts = list.filter((a) => a.active);
        
        // Filter out recently dismissed alerts
        const dismissedAlerts = JSON.parse(localStorage.getItem('dismissedAlerts') || '{}');
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        const visibleAlerts = activeAlerts.filter(alert => {
          const dismissedTime = dismissedAlerts[alert.id];
          // Show if not dismissed or dismissed more than 1 hour ago
          return !dismissedTime || (now - dismissedTime) >= oneHour;
        });
        
        setAlerts(visibleAlerts);
      });
  }, [i18n.resolvedLanguage]);
  
  const handleClose = (alertId) => {
    // Store the dismissed alert ID with current timestamp
    const dismissedAlerts = JSON.parse(localStorage.getItem('dismissedAlerts') || '{}');
    dismissedAlerts[alertId] = Date.now();
    localStorage.setItem('dismissedAlerts', JSON.stringify(dismissedAlerts));
    
    // Remove from displayed alerts
    setAlerts(alerts.filter(a => a.id !== alertId));
  };
  
  if (alerts.length === 0) return null;
  
  return (
    <div className="container mx-auto px-4 mt-3 space-y-3">
      {alerts.map((alert) => {
        const level = alert.level || "info";
        return (
          <div
            key={alert.id}
            className={`${
              level === "warning"
                ? "bg-yellow-50 border-yellow-200"
                : level === "danger"
                ? "bg-red-50 border-red-200"
                : "bg-gray-50 border-gray-200"
            } rounded-md border p-4 flex items-start gap-3`}
          >
            {alert.attachmentType === "image" && alert.attachmentUrl && (
              <img
                src={alert.attachmentUrl}
                alt="alert"
                className="max-h-16 rounded"
              />
            )}
            <div className="flex-1 text-gray-800">
              <div className="font-semibold mb-1">{t("alert.important")}</div>
              <div>{alert.message}</div>
            </div>
            <button
              onClick={() => handleClose(alert.id)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Dismiss alert"
            >
              <i className="fa-solid fa-times" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
