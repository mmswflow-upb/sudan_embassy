import { useTranslation } from "react-i18next";

export default function MapSettings({ settings, setSettings }) {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 p-4 rounded">
      <h3 className="font-semibold mb-2">{t('admin.settings.map_section')}</h3>
      <label className="block text-sm mb-1">{t('admin.settings.latitude')}</label>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        value={settings.map.lat}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            map: { ...s.map, lat: e.target.value },
          }))
        }
      />
      <label className="block text-sm mb-1">{t('admin.settings.longitude')}</label>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        value={settings.map.lng}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            map: { ...s.map, lng: e.target.value },
          }))
        }
      />
      <label className="block text-sm mb-1">{t('admin.settings.place_link')}</label>
      <input
        className="w-full border rounded px-3 py-2"
        value={settings.map.placeLink}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            map: { ...s.map, placeLink: e.target.value },
          }))
        }
      />
    </div>
  );
}
