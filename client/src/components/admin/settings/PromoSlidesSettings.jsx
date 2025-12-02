import { useTranslation } from "react-i18next";

export default function PromoSlidesSettings({ settings, setSettings, selectedLang }) {
  const { t } = useTranslation();

  return (
    <div className="bg-purple-50 p-4 rounded md:col-span-2">
      <h4 className="font-semibold mb-3">{t('admin.settings.promo_slides')}</h4>
      <div className="space-y-4">
        {Object.keys(settings.promoSlides).map((key) => (
          <div key={key} className="border-b pb-3">
            <div className="font-medium text-sm mb-2">{t(`admin.settings.${key}`)}</div>
            <div className="space-y-2">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder={t('admin.settings.promo_title')}
                value={settings.i18n?.[selectedLang]?.promoSlides?.[key]?.title || ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    i18n: {
                      ...s.i18n,
                      [selectedLang]: {
                        ...s.i18n[selectedLang],
                        promoSlides: {
                          ...s.i18n[selectedLang]?.promoSlides,
                          [key]: {
                            ...s.i18n[selectedLang]?.promoSlides?.[key],
                            title: e.target.value
                          }
                        }
                      },
                    },
                  }))
                }
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder={t('admin.settings.promo_subtitle')}
                value={settings.i18n?.[selectedLang]?.promoSlides?.[key]?.subtitle || ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    i18n: {
                      ...s.i18n,
                      [selectedLang]: {
                        ...s.i18n[selectedLang],
                        promoSlides: {
                          ...s.i18n[selectedLang]?.promoSlides,
                          [key]: {
                            ...s.i18n[selectedLang]?.promoSlides?.[key],
                            subtitle: e.target.value
                          }
                        }
                      },
                    },
                  }))
                }
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder={t('admin.settings.promo_cta')}
                value={settings.i18n?.[selectedLang]?.promoSlides?.[key]?.cta || ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    i18n: {
                      ...s.i18n,
                      [selectedLang]: {
                        ...s.i18n[selectedLang],
                        promoSlides: {
                          ...s.i18n[selectedLang]?.promoSlides,
                          [key]: {
                            ...s.i18n[selectedLang]?.promoSlides?.[key],
                            cta: e.target.value
                          }
                        }
                      },
                    },
                  }))
                }
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder={t('admin.settings.promo_link')}
                value={settings.promoSlides?.[key]?.href || ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    promoSlides: {
                      ...s.promoSlides,
                      [key]: {
                        ...s.promoSlides[key],
                        href: e.target.value
                      }
                    }
                  }))
                }
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder={t('admin.settings.promo_image')}
                value={settings.promoSlides?.[key]?.image || ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    promoSlides: {
                      ...s.promoSlides,
                      [key]: {
                        ...s.promoSlides[key],
                        image: e.target.value
                      }
                    }
                  }))
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
