import { useTranslation } from "react-i18next";

export default function EmergencySettings({ settings, setSettings, selectedLang }) {
  const { t } = useTranslation();

  return (
    <div className="bg-yellow-50 p-4 rounded">
      <h3 className="font-semibold mb-2">{t('admin.settings.emergency_section')}</h3>
      <label className="block text-sm mb-1">{t('admin.settings.emergency_phone')} (Non-i18n)</label>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        value={settings.emergency.phone}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            emergency: { ...s.emergency, phone: e.target.value },
          }))
        }
      />
      <label className="block text-sm mb-1">{t('admin.settings.emergency_note')} ({selectedLang.toUpperCase()})</label>
      <input
        className="w-full border rounded px-3 py-2"
        value={settings.i18n?.[selectedLang]?.emergency?.note || ""}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            i18n: {
              ...s.i18n,
              [selectedLang]: {
                ...s.i18n[selectedLang],
                emergency: { note: e.target.value },
              },
            },
          }))
        }
      />
    </div>
  );
}
