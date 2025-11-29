import { useTranslation } from "react-i18next";

export default function ContactsSettings({ settings, setSettings, selectedLang }) {
  const { t } = useTranslation();

  function updateContact(key, field, value) {
    setSettings((s) => ({
      ...s,
      contacts: {
        ...s.contacts,
        [key]: field === "icon" 
          ? [value, s.contacts[key][1]] 
          : [s.contacts[key][0], value]
      }
    }));
  }

  return (
    <div className="bg-gray-50 p-4 rounded md:col-span-2">
      <h3 className="font-semibold mb-3">
        {t('admin.settings.contacts_section')} ({selectedLang.toUpperCase()})
      </h3>
      <div className="space-y-2">
        {Object.entries(settings.contacts).map(([key, row]) => (
          <div
            key={key}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center"
          >
            <div className="md:col-span-2 text-sm font-medium">{key}</div>
            <input
              className="md:col-span-4 border rounded px-3 py-2"
              placeholder="Icon class"
              value={row[0]}
              onChange={(e) => updateContact(key, "icon", e.target.value)}
              disabled
              title="Icon is not translated"
            />
            <input
              className="md:col-span-6 border rounded px-3 py-2"
              placeholder="Text"
              value={settings.i18n?.[selectedLang]?.contacts?.[key] || row[1]}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  i18n: {
                    ...s.i18n,
                    [selectedLang]: {
                      ...s.i18n[selectedLang],
                      contacts: {
                        ...s.i18n[selectedLang]?.contacts,
                        [key]: e.target.value
                      },
                    },
                  },
                }))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
