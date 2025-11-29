import { useTranslation } from "react-i18next";

export default function HoursSettings({ settings, setSettings, selectedLang }) {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 p-4 rounded md:col-span-2">
      <h3 className="font-semibold mb-2">{t('admin.settings.hours_section')} ({selectedLang.toUpperCase()})</h3>
      <label className="block text-sm mb-1">{t('admin.settings.mon_thu')}</label>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        value={settings.i18n?.[selectedLang]?.hours?.monThu || settings.hours.monThu}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            i18n: {
              ...s.i18n,
              [selectedLang]: {
                ...s.i18n[selectedLang],
                hours: { ...s.i18n[selectedLang]?.hours, monThu: e.target.value },
              },
            },
          }))
        }
      />
      <label className="block text-sm mb-1">{t('admin.settings.fri')}</label>
      <input
        className="w-full border rounded px-3 py-2"
        value={settings.i18n?.[selectedLang]?.hours?.fri || settings.hours.fri}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            i18n: {
              ...s.i18n,
              [selectedLang]: {
                ...s.i18n[selectedLang],
                hours: { ...s.i18n[selectedLang]?.hours, fri: e.target.value },
              },
            },
          }))
        }
      />
    </div>
  );
}
