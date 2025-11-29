import { useTranslation } from "react-i18next";

export default function StatusBarSettings({ settings, setSettings, selectedLang }) {
  const { t } = useTranslation();

  return (
    <div className="bg-green-50 p-4 rounded">
      <h4 className="font-semibold mb-2">{t('admin.settings.status_bar')}</h4>
      <label className="block text-sm mb-1">{t('admin.settings.status')}</label>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        value={settings.i18n?.[selectedLang]?.statusBar?.status || ""}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            i18n: {
              ...s.i18n,
              [selectedLang]: {
                ...s.i18n[selectedLang],
                statusBar: { ...s.i18n[selectedLang].statusBar, status: e.target.value },
              },
            },
          }))
        }
      />
      <label className="block text-sm mb-1">{t('admin.settings.holiday')}</label>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        value={settings.i18n?.[selectedLang]?.statusBar?.holiday || ""}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            i18n: {
              ...s.i18n,
              [selectedLang]: {
                ...s.i18n[selectedLang],
                statusBar: { ...s.i18n[selectedLang].statusBar, holiday: e.target.value },
              },
            },
          }))
        }
      />
      <label className="block text-sm mb-1">{t('admin.settings.next_appointment')}</label>
      <input
        className="w-full border rounded px-3 py-2"
        value={settings.i18n?.[selectedLang]?.statusBar?.nextAppointment || ""}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            i18n: {
              ...s.i18n,
              [selectedLang]: {
                ...s.i18n[selectedLang],
                statusBar: { ...s.i18n[selectedLang].statusBar, nextAppointment: e.target.value },
              },
            },
          }))
        }
      />
    </div>
  );
}
