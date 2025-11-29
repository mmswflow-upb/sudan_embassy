import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Upload from "../Upload.jsx";
import { uploadToStorage } from "../../lib/storage.js";

export function ConsularEditForm({ item, viewLang, onSave, onCancel, onChange }) {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);

  useEffect(() => {
    if (pendingSave && !uploading) {
      setPendingSave(false);
      onSave();
    }
  }, [item, pendingSave, uploading, onSave]);

  const handleSave = async () => {
    if (file && !uploading) {
      setUploading(true);
      try {
        const { downloadURL } = await uploadToStorage("consular", file, setProgress);
        const attachmentType = file.type?.includes("pdf")
          ? "pdf"
          : file.type?.startsWith("image/")
          ? "image"
          : "file";
        const updatedItem = {
          ...item,
          attachmentUrl: downloadURL,
          fileName: file.name,
          attachmentType
        };
        onChange(updatedItem);
        setFile(null);
        setProgress(0);
        setUploading(false);
        setPendingSave(true);
      } catch (err) {
        setUploading(false);
        throw err;
      }
    } else {
      onSave();
    }
  };

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
      <div className="text-xs text-gray-600">
        {item?.attachmentUrl ? (
          <div className="flex items-center gap-2">
            {item.attachmentType === 'image' && (
              <img src={item.attachmentUrl} alt="Current" className="h-12 w-12 object-cover rounded" />
            )}
            <span>Current: {item.fileName || 'File attached'}</span>
            <button
              type="button"
              className="text-red-600 hover:text-red-800"
              onClick={() => onChange({ ...item, attachmentUrl: null, fileName: null, attachmentType: null })}
            >
              Remove
            </button>
          </div>
        ) : (
          <span>No attachment</span>
        )}
      </div>
      <Upload onFile={setFile} accept="image/*,application/pdf" />
      {progress > 0 && (
        <div className="text-xs text-gray-600">{t('admin.common.upload_progress', { progress })}</div>
      )}
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:bg-gray-400"
          onClick={handleSave}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : t('admin.common.save')}
        </button>
        <button
          className="px-3 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
          onClick={onCancel}
          disabled={uploading}
        >
          {t('admin.common.cancel')}
        </button>
      </div>
    </div>
  );
}

export function NewsEditForm({ item, viewLang, onSave, onCancel, onChange }) {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);

  useEffect(() => {
    if (pendingSave && !uploading) {
      setPendingSave(false);
      onSave();
    }
  }, [item, pendingSave, uploading, onSave]);

  const handleSave = async () => {
    if (file && !uploading) {
      setUploading(true);
      try {
        const { downloadURL } = await uploadToStorage("news", file, setProgress);
        const updatedItem = {
          ...item,
          image: downloadURL
        };
        onChange(updatedItem);
        setFile(null);
        setProgress(0);
        setUploading(false);
        setPendingSave(true);
      } catch (err) {
        setUploading(false);
        throw err;
      }
    } else {
      onSave();
    }
  };

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
      <div className="text-xs text-gray-600">
        {item?.image ? (
          <div className="flex items-center gap-2">
            <img src={item.image} alt="Current" className="h-12 w-12 object-cover rounded" />
            <button
              type="button"
              className="text-red-600 hover:text-red-800"
              onClick={() => onChange({ ...item, image: null })}
            >
              Remove
            </button>
          </div>
        ) : (
          <span>No image</span>
        )}
      </div>
      <Upload onFile={setFile} accept="image/*" />
      {progress > 0 && (
        <div className="text-xs text-gray-600">{t('admin.common.upload_progress', { progress })}</div>
      )}
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:bg-gray-400"
          onClick={handleSave}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : t('admin.common.save')}
        </button>
        <button
          className="px-3 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
          onClick={onCancel}
          disabled={uploading}
        >
          {t('admin.common.cancel')}
        </button>
      </div>
    </div>
  );
}

export function AlertEditForm({ item, viewLang, onSave, onCancel, onChange }) {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);

  useEffect(() => {
    if (pendingSave && !uploading) {
      setPendingSave(false);
      onSave();
    }
  }, [item, pendingSave, uploading, onSave]);

  const handleSave = async () => {
    if (file && !uploading) {
      setUploading(true);
      try {
        const { downloadURL } = await uploadToStorage("alerts", file, setProgress);
        const attachmentType = file.type?.includes("pdf")
          ? "pdf"
          : file.type?.startsWith("image/")
          ? "image"
          : "file";
        const updatedItem = {
          ...item,
          attachmentUrl: downloadURL,
          fileName: file.name,
          attachmentType
        };
        onChange(updatedItem);
        setFile(null);
        setProgress(0);
        setUploading(false);
        setPendingSave(true);
      } catch (err) {
        setUploading(false);
        throw err;
      }
    } else {
      onSave();
    }
  };

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
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`alert-active-${item.id}`}
          checked={item?.active !== false}
          onChange={(e) => onChange({ ...item, active: e.target.checked })}
          className="w-4 h-4"
        />
        <label htmlFor={`alert-active-${item.id}`} className="text-sm">
          {t('admin.alerts.active')}
        </label>
      </div>
      <div className="text-xs text-gray-600">
        {item?.attachmentUrl ? (
          <div className="flex items-center gap-2">
            <span>Current: {item.fileName || 'File attached'}</span>
            <button
              type="button"
              className="text-red-600 hover:text-red-800"
              onClick={() => onChange({ ...item, attachmentUrl: null, fileName: null, attachmentType: null })}
            >
              Remove
            </button>
          </div>
        ) : (
          <span>No attachment</span>
        )}
      </div>
      <Upload onFile={setFile} accept="image/*,application/pdf" />
      {progress > 0 && (
        <div className="text-xs text-gray-600">{t('admin.common.upload_progress', { progress })}</div>
      )}
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:bg-gray-400"
          onClick={handleSave}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : t('admin.common.save')}
        </button>
        <button
          className="px-3 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
          onClick={onCancel}
          disabled={uploading}
        >
          {t('admin.common.cancel')}
        </button>
      </div>
    </div>
  );
}

export function FormEditForm({ item, viewLang, onSave, onCancel, onChange }) {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);

  useEffect(() => {
    if (pendingSave && !uploading) {
      setPendingSave(false);
      onSave();
    }
  }, [item, pendingSave, uploading, onSave]);

  const handleSave = async () => {
    if (file && !uploading) {
      setUploading(true);
      try {
        const { downloadURL } = await uploadToStorage("forms", file, setProgress);
        const updatedItem = {
          ...item,
          fileUrl: downloadURL
        };
        onChange(updatedItem);
        setFile(null);
        setProgress(0);
        setUploading(false);
        setPendingSave(true);
      } catch (err) {
        setUploading(false);
        throw err;
      }
    } else {
      onSave();
    }
  };

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
      <div className="text-xs text-gray-600">
        {item?.fileUrl ? (
          <div className="flex items-center gap-2">
            <span>Current file attached</span>
            <a 
              href={item.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              View
            </a>
          </div>
        ) : (
          <span>No file</span>
        )}
      </div>
      <Upload onFile={setFile} accept="application/pdf" />
      {progress > 0 && (
        <div className="text-xs text-gray-600">{t('admin.common.upload_progress', { progress })}</div>
      )}
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:bg-gray-400"
          onClick={handleSave}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : t('admin.common.save')}
        </button>
        <button
          className="px-3 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
          onClick={onCancel}
          disabled={uploading}
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
