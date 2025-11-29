import { useTranslation } from "react-i18next";

export function ConsularEditForm({ item, viewLang, onSave, onCancel, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 space-y-2">
      <input
        className="w-full border rounded px-2 py-1 text-sm"
        placeholder={t('admin.consular.name')}
        value={item?.i18n?.[viewLang]?.name || item?.name || ''}
        onChange={(e) => onChange({
          ...item,
          i18n: {
            ...item.i18n,
            [viewLang]: {
              ...(item.i18n?.[viewLang] || {}),
              name: e.target.value
            }
          }
        })}
      />
      <textarea
        className="w-full border rounded px-2 py-1 text-sm"
        placeholder={t('admin.consular.details')}
        rows={3}
        value={item?.i18n?.[viewLang]?.details || item?.details || ''}
        onChange={(e) => onChange({
          ...item,
          i18n: {
            ...item.i18n,
            [viewLang]: {
              ...(item.i18n?.[viewLang] || {}),
              details: e.target.value
            }
          }
        })}
      />
      <input
        className="w-full border rounded px-2 py-1 text-sm"
        placeholder={t('admin.consular.icon')}
        value={item?.icon || ''}
        onChange={(e) => onChange({ ...item, icon: e.target.value })}
      />
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
          onClick={onSave}
        >
          {t('admin.common.save')}
        </button>
        <button
          className="px-3 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
          onClick={onCancel}
        >
          {t('admin.common.cancel')}
        </button>
      </div>
    </div>
  );
}

export function NewsEditForm({ item, viewLang, onSave, onCancel, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 space-y-2">
      <input
        className="w-full border rounded px-2 py-1 text-sm"
        placeholder={t('admin.news.news_title')}
        value={item?.i18n?.[viewLang]?.title || item?.title || ''}
        onChange={(e) => onChange({
          ...item,
          i18n: {
            ...item.i18n,
            [viewLang]: {
              ...(item.i18n?.[viewLang] || {}),
              title: e.target.value
            }
          }
        })}
      />
      <textarea
        className="w-full border rounded px-2 py-1 text-sm"
        placeholder={t('admin.news.summary')}
        rows={2}
        value={item?.i18n?.[viewLang]?.summary || item?.summary || ''}
        onChange={(e) => onChange({
          ...item,
          i18n: {
            ...item.i18n,
            [viewLang]: {
              ...(item.i18n?.[viewLang] || {}),
              summary: e.target.value
            }
          }
        })}
      />
      <select
        className="w-full border rounded px-2 py-1 text-sm bg-white"
        value={item?.i18n?.[viewLang]?.tag || item?.tag || 'General'}
        onChange={(e) => onChange({
          ...item,
          i18n: {
            ...item.i18n,
            [viewLang]: {
              ...(item.i18n?.[viewLang] || {}),
              tag: e.target.value
            }
          }
        })}
      >
        <option value="General">General</option>
        <option value="Visa">Visa</option>
        <option value="Passport">Passport</option>
        <option value="Consular">Consular</option>
        <option value="Event">Event</option>
      </select>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
          onClick={onSave}
        >
          {t('admin.common.save')}
        </button>
        <button
          className="px-3 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
          onClick={onCancel}
        >
          {t('admin.common.cancel')}
        </button>
      </div>
    </div>
  );
}

export function AlertEditForm({ item, viewLang, onSave, onCancel, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 space-y-2">
      <textarea
        className="w-full border rounded px-2 py-1 text-sm"
        value={item?.i18n?.[viewLang]?.message || item?.message || ''}
        rows={2}
        onChange={(e) => onChange({
          ...item,
          i18n: {
            ...item.i18n,
            [viewLang]: {
              ...(item.i18n?.[viewLang] || {}),
              message: e.target.value
            }
          }
        })}
      />
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
          onClick={onSave}
        >
          {t('admin.common.save')}
        </button>
        <button
          className="px-3 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
          onClick={onCancel}
        >
          {t('admin.common.cancel')}
        </button>
      </div>
    </div>
  );
}

export function FormEditForm({ item, viewLang, onSave, onCancel, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 space-y-2">
      <input
        className="w-full border rounded px-2 py-1 text-sm"
        value={item?.i18n?.[viewLang]?.title || item?.title || ''}
        onChange={(e) => onChange({
          ...item,
          i18n: {
            ...item.i18n,
            [viewLang]: {
              ...(item.i18n?.[viewLang] || {}),
              title: e.target.value
            }
          }
        })}
      />
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
          onClick={onSave}
        >
          {t('admin.common.save')}
        </button>
        <button
          className="px-3 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
          onClick={onCancel}
        >
          {t('admin.common.cancel')}
        </button>
      </div>
    </div>
  );
}

export function LanguageSelector({ viewLang, onLangChange }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className={`px-3 py-1 rounded text-sm ${viewLang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => onLangChange('en')}
      >
        EN
      </button>
      <button
        type="button"
        className={`px-3 py-1 rounded text-sm ${viewLang === 'ro' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => onLangChange('ro')}
      >
        RO
      </button>
      <button
        type="button"
        className={`px-3 py-1 rounded text-sm ${viewLang === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => onLangChange('ar')}
      >
        AR
      </button>
    </div>
  );
}
