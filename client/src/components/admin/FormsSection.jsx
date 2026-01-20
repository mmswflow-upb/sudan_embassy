import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { getApiUrl } from "../../config.js";
import { Field, TextInput, TextArea, Button } from "../UI.jsx";
import Upload from "../Upload.jsx";
import { uploadToStorage } from "../../lib/storage.js";
import { FormEditForm, LanguageSelector } from "./EditForms.jsx";

function withTokenHeaders(init = {}) {
  const token = localStorage.getItem("fbToken") || "";
  return {
    ...init,
    headers: { ...(init.headers || {}), Authorization: `Bearer ${token}` },
  };
}

function useAdminList(path) {
  const [items, setItems] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const url = path.includes('?') ? `${path}&lang=en` : `${path}?lang=en`;
    fetch(getApiUrl(url), withTokenHeaders())
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch items');
        return r.json();
      })
      .then(setItems)
      .catch((err) => {
        console.error('Error fetching items:', err);
        toast.error(`Failed to load items: ${err.message}`);
        setItems([]);
      });
  }, [path, refreshKey]);

  const refresh = () => setRefreshKey(k => k + 1);
  return [items, setItems, refresh];
}

function FormsCreate({ onSuccess }) {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedLang, setSelectedLang] = useState("en");
  const [i18nVals, setI18nVals] = useState({
    en: { title: "", description: "" },
    ro: { title: "", description: "" },
    ar: { title: "", description: "" },
  });

  async function submit(e) {
    e.preventDefault();

    // Validate all languages
    const missingLangs = [];
    if (!i18nVals.en.title || !i18nVals.en.description) missingLangs.push('English');
    if (!i18nVals.ro.title || !i18nVals.ro.description) missingLangs.push('Romanian');
    if (!i18nVals.ar.title || !i18nVals.ar.description) missingLangs.push('Arabic');
    
    if (missingLangs.length > 0) {
      toast.error(`Please fill all fields for: ${missingLangs.join(', ')}`);
      return;
    }

    if (!file) {
      toast.error(t('admin.forms.file_required'));
      return;
    }
    const { downloadURL } = await uploadToStorage("forms", file, setProgress);
    const token = localStorage.getItem("fbToken") || "";
    await fetch(getApiUrl("/api/forms"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: i18nVals.en.title,
        description: i18nVals.en.description,
        fileUrl: downloadURL,
        i18n: i18nVals,
      }),
    });
    setFile(null);
    setProgress(0);
    setI18nVals({
      en: { title: "", description: "" },
      ro: { title: "", description: "" },
      ar: { title: "", description: "" },
    });
    toast.success(t('admin.forms.saved'));
    if (onSuccess) onSuccess();
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label={t('admin.forms.file')}>
        <Upload onFile={setFile} accept="application/pdf" />
        {progress > 0 && (
          <div className="text-sm text-gray-600 mt-1">{t('admin.common.upload_progress', { progress })}</div>
        )}
      </Field>
      <div className="border-t pt-4 mt-4">
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            className={`px-4 py-2 rounded ${selectedLang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedLang('en')}
          >
            {t('admin.i18n.english')}
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded ${selectedLang === 'ro' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedLang('ro')}
          >
            {t('admin.i18n.romanian')}
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded ${selectedLang === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedLang('ar')}
          >
            {t('admin.i18n.arabic')}
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <Field label={t(`admin.i18n.title_${selectedLang}`)}>
            <TextInput
              value={i18nVals[selectedLang].title}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  [selectedLang]: { ...s[selectedLang], title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label={t(`admin.i18n.description_${selectedLang}`)}>
            <TextArea
              rows={3}
              value={i18nVals[selectedLang].description}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  [selectedLang]: { ...s[selectedLang], description: e.target.value },
                }))
              }
            />
          </Field>
        </div>
      </div>
      <Button>{t('admin.forms.save')}</Button>
    </form>
  );
}

function FormsList({ refreshTrigger }) {
  const { t } = useTranslation();
  const [items, setItems, refresh] = useAdminList("/api/forms");

  useEffect(() => {
    if (refreshTrigger) refresh();
  }, [refreshTrigger]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [viewLang, setViewLang] = useState('en');
  
  async function remove(id) {
    if (!confirm(t('admin.common.confirm_delete'))) return;
    await fetch(
      getApiUrl(`/api/forms/${id}`),
      withTokenHeaders({ method: "DELETE" })
    );
    setItems(items.filter((i) => i.id !== id));
    toast.success(t('admin.forms.deleted'));
  }
  
  function startEdit(item) {
    const itemId = item.id || item.createdAt;
    setEditingId(itemId);
    setEditData({ ...item, id: itemId });
  }
  
  async function saveEdit() {
    const token = localStorage.getItem("fbToken") || "";
    await fetch(getApiUrl(`/api/forms/${editData.id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editData),
    });
    setItems(items.map(i => (i.id || i.createdAt) === editData.id ? editData : i));
    setEditingId(null);
    setEditData(null);
    toast.success(t('admin.forms.updated'));
  }
  
  function cancelEdit() {
    setEditingId(null);
    setEditData(null);
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t('admin.forms.list_title')}</h2>
        <LanguageSelector viewLang={viewLang} onLangChange={setViewLang} />
      </div>
      <div className="space-y-2 max-h-[360px] overflow-auto">
        {items.map((item) => {
          const itemId = item.id || item.createdAt;
          const isEditing = editingId !== null && editingId === itemId && editData !== null;
          const displayTitle = item.i18n?.[viewLang]?.title || item.title;
          
          return (
            <div
              key={itemId}
              className="flex items-center justify-between border rounded p-3 text-sm"
            >
              {isEditing ? (
                <FormEditForm
                  item={editData}
                  viewLang={viewLang}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                  onChange={setEditData}
                />
              ) : (
                <>
                  <div className="font-medium">{displayTitle}</div>
                  <div className="flex items-center gap-3">
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sudan-blue hover:text-sudan-blue/80"
                      title={t('admin.forms.download')}
                    >
                      <i className="fa-solid fa-download"></i>
                    </a>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => startEdit(item)}
                      title={t('admin.common.edit')}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => remove(item.id || item.createdAt)}
                      title={t('admin.common.delete')}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="text-gray-500">{t('admin.forms.no_forms')}</div>
        )}
      </div>
    </div>
  );
}

export default function FormsSection() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <>
      <div className="col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Add Form</h2>
          <FormsCreate onSuccess={() => setRefreshTrigger(t => t + 1)} />
        </div>
      </div>
      <div className="col-span-1">
        <FormsList refreshTrigger={refreshTrigger} />
      </div>
    </>
  );
}
