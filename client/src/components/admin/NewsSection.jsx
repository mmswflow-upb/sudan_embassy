import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { getApiUrl } from "../../config.js";
import { Field, TextInput, TextArea, Button } from "../UI.jsx";
import Upload from "../Upload.jsx";
import { uploadToStorage } from "../../lib/storage.js";
import { NewsEditForm, LanguageSelector } from "./EditForms.jsx";

function withTokenHeaders(init = {}) {
  const token = localStorage.getItem("fbToken") || "";
  return {
    ...init,
    headers: { ...(init.headers || {}), Authorization: `Bearer ${token}` },
  };
}

function useAdminList(path) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const url = path.includes('?') ? `${path}&lang=en` : `${path}?lang=en`;
    fetch(getApiUrl(url), withTokenHeaders())
      .then((r) => r.json())
      .then(setItems);
  }, []);
  return [items, setItems];
}

function NewsForm() {
  const { t } = useTranslation();
  const schema = z.object({
    title: z.string().min(3),
    summary: z.string().min(10),
    tag: z.string().min(2),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: "", summary: "", tag: "General" },
  });
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedLang, setSelectedLang] = useState("en");
  const [i18nVals, setI18nVals] = useState({
    en: { title: "", summary: "" },
    ro: { title: "", summary: "" },
    ar: { title: "", summary: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    // Validate all languages
    const missingLangs = [];
    if (!i18nVals.en.title || !i18nVals.en.summary) missingLangs.push('English');
    if (!i18nVals.ro.title || !i18nVals.ro.summary) missingLangs.push('Romanian');
    if (!i18nVals.ar.title || !i18nVals.ar.summary) missingLangs.push('Arabic');
    
    if (missingLangs.length > 0) {
      toast.error(`Please fill all fields for: ${missingLangs.join(', ')}`);
      return;
    }

    let image = null;
    if (file) {
      const { downloadURL } = await uploadToStorage("news", file, setProgress);
      image = downloadURL;
    }
    const token = localStorage.getItem("fbToken") || "";
    await fetch(getApiUrl("/api/news"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...values, image, i18n: i18nVals }),
    });
    reset();
    setFile(null);
    setProgress(0);
    toast.success(t('admin.news.saved'));
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Field label={t('admin.news.tag')}>
        <select
          {...register("tag")}
          className="w-full border rounded px-3 py-2 bg-white"
        >
          <option value="General">General</option>
          <option value="Visa">Visa</option>
          <option value="Passport">Passport</option>
          <option value="Consular">Consular</option>
          <option value="Event">Event</option>
        </select>
      </Field>
      <Field label={t('admin.news.image')}>
        <Upload onFile={setFile} accept="image/*" />
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
          <Field label={t(`admin.i18n.summary_${selectedLang}`)}>
            <TextArea
              rows={4}
              value={i18nVals[selectedLang].summary}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  [selectedLang]: { ...s[selectedLang], summary: e.target.value },
                }))
              }
            />
          </Field>
        </div>
      </div>
      <Button disabled={isSubmitting}>
        {isSubmitting ? t('admin.news.publishing') : t('admin.news.publish')}
      </Button>
    </form>
  );
}

function NewsList() {
  const { t } = useTranslation();
  const [items, setItems] = useAdminList("/api/news");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [viewLang, setViewLang] = useState('en');
  
  async function remove(id) {
    if (!confirm(t('admin.common.confirm_delete'))) return;
    await fetch(
      getApiUrl(`/api/news/${id}`),
      withTokenHeaders({ method: "DELETE" })
    );
    setItems(items.filter((i) => i.id !== id));
    toast.success(t('admin.news.deleted'));
  }
  
  function startEdit(item) {
    const itemId = item.id || item.createdAt;
    setEditingId(itemId);
    setEditData({ ...item, id: itemId });
  }
  
  async function saveEdit() {
    const token = localStorage.getItem("fbToken") || "";
    await fetch(getApiUrl(`/api/news/${editData.id}`), {
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
    toast.success(t('admin.news.updated'));
  }
  
  function cancelEdit() {
    setEditingId(null);
    setEditData(null);
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t('admin.news.list_title')}</h2>
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
                <NewsEditForm
                  item={editData}
                  viewLang={viewLang}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                  onChange={setEditData}
                />
              ) : (
                <>
                  <div className="font-medium">{displayTitle}</div>
                  <div className="flex items-center gap-2">
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
          <div className="text-gray-500">{t('admin.news.no_news')}</div>
        )}
      </div>
    </div>
  );
}

export default function NewsSection() {
  return (
    <>
      <div className="col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Add News</h2>
          <NewsForm />
        </div>
      </div>
      <div className="col-span-1">
        <NewsList />
      </div>
    </>
  );
}
