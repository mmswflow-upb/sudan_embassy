import { useTranslation } from "react-i18next";

export default function HeroSettings({ settings, setSettings, selectedLang }) {
  const { t } = useTranslation();

  return (
    <div className="bg-blue-50 p-4 rounded">
      <h4 className="font-semibold mb-2">{t('admin.settings.hero_section')}</h4>
      <label className="block text-sm mb-1">{t('admin.settings.hero_title')}</label>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        value={settings.i18n?.[selectedLang]?.hero?.title || ""}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            i18n: {
              ...s.i18n,
              [selectedLang]: {
                ...s.i18n[selectedLang],
                hero: { ...s.i18n[selectedLang].hero, title: e.target.value },
              },
            },
          }))
        }
      />
      <label className="block text-sm mb-1">{t('admin.settings.hero_subtitle')}</label>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        value={settings.i18n?.[selectedLang]?.hero?.subtitle || ""}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            i18n: {
              ...s.i18n,
              [selectedLang]: {
                ...s.i18n[selectedLang],
                hero: { ...s.i18n[selectedLang].hero, subtitle: e.target.value },
              },
            },
          }))
        }
      />
      <label className="block text-sm mb-1">{t('admin.settings.hero_cta1')}</label>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        value={settings.i18n?.[selectedLang]?.hero?.cta1 || ""}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            i18n: {
              ...s.i18n,
              [selectedLang]: {
                ...s.i18n[selectedLang],
                hero: { ...s.i18n[selectedLang].hero, cta1: e.target.value },
              },
            },
          }))
        }
      />
      <label className="block text-sm mb-1">{t('admin.settings.hero_cta2')}</label>
      <input
        className="w-full border rounded px-3 py-2"
        value={settings.i18n?.[selectedLang]?.hero?.cta2 || ""}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            i18n: {
              ...s.i18n,
              [selectedLang]: {
                ...s.i18n[selectedLang],
                hero: { ...s.i18n[selectedLang].hero, cta2: e.target.value },
              },
            },
          }))
        }
      />
    </div>
  );
}
