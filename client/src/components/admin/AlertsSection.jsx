import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { getApiUrl } from "../../config.js";
import { Field, TextArea, Button } from "../UI.jsx";
import { AlertEditForm, LanguageSelector } from "./EditForms.jsx";

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

function AlertForm() {
  const { t } = useTranslation();
  const schema = z.object({
    message: z.string().min(5),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { message: "" },
  });
  const [selectedLang, setSelectedLang] = useState("en");
  const [i18nVals, setI18nVals] = useState({
    en: { message: "" },
    ro: { message: "" },
    ar: { message: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    // Validate all languages
    const missingLangs = [];
    if (!i18nVals.en.message) missingLangs.push('English');
    if (!i18nVals.ro.message) missingLangs.push('Romanian');
    if (!i18nVals.ar.message) missingLangs.push('Arabic');
    
    if (missingLangs.length > 0) {
      toast.error(`Please fill all fields for: ${missingLangs.join(', ')}`);
      return;
    }

    const token = localStorage.getItem("fbToken") || "";
    await fetch(getApiUrl("/api/alerts"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...values, i18n: i18nVals }),
    });
    reset();
    toast.success(t('admin.alerts.saved'));
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="border-t pt-4">
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
          <Field label={t(`admin.i18n.message_${selectedLang}`)}>
            <TextArea
              rows={3}
              value={i18nVals[selectedLang].message}
              onChange={(e) =>
                setI18nVals((s) => ({
                  ...s,
                  [selectedLang]: { ...s[selectedLang], message: e.target.value },
                }))
              }
            />
          </Field>
        </div>
      </div>
      <Button disabled={isSubmitting}>
        {isSubmitting ? t('admin.alerts.creating') : t('admin.alerts.create')}
      </Button>
    </form>
  );
}

function AlertsList() {
  const { t } = useTranslation();
  const [items, setItems] = useAdminList("/api/alerts");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [viewLang, setViewLang] = useState('en');
  
  async function remove(id) {
    if (!confirm(t('admin.common.confirm_delete'))) return;
    await fetch(
      getApiUrl(`/api/alerts/${id}`),
      withTokenHeaders({ method: "DELETE" })
    );
    setItems(items.filter((i) => i.id !== id));
    toast.success(t('admin.alerts.deleted'));
  }
  
  function startEdit(item) {
    const itemId = item.id || item.createdAt;
    setEditingId(itemId);
    setEditData({ ...item, id: itemId });
  }
  
  async function saveEdit() {
    const token = localStorage.getItem("fbToken") || "";
    await fetch(getApiUrl(`/api/alerts/${editData.id}`), {
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
    toast.success(t('admin.alerts.updated'));
  }
  
  function cancelEdit() {
    setEditingId(null);
    setEditData(null);
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t('admin.alerts.list_title')}</h2>
        <LanguageSelector viewLang={viewLang} onLangChange={setViewLang} />
      </div>
      <div className="space-y-2 max-h-[360px] overflow-auto">
        {items.map((item) => {
          const itemId = item.id || item.createdAt;
          const isEditing = editingId !== null && editingId === itemId && editData !== null;
          const displayMessage = item.i18n?.[viewLang]?.message || item.message;
          
          return (
            <div
              key={itemId}
              className="flex items-center justify-between border rounded p-3 text-sm"
            >
              {isEditing ? (
                <AlertEditForm
                  item={editData}
                  viewLang={viewLang}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                  onChange={setEditData}
                />
              ) : (
                <>
                  <div>{displayMessage}</div>
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
          <div className="text-gray-500">{t('admin.alerts.no_alerts')}</div>
        )}
      </div>
    </div>
  );
}

export default function AlertsSection() {
  return (
    <>
      <div className="col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Add Alert</h2>
          <AlertForm />
        </div>
      </div>
      <div className="col-span-1">
        <AlertsList />
      </div>
    </>
  );
}
