import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'

export default function Upload({ onFile, previewUrl, accept = 'image/*' }){
  const { t } = useTranslation()
  const [localPreview, setLocalPreview] = useState(previewUrl || '')
  const onDrop = useCallback((accepted) => {
    const f = accepted[0]
    if (!f) return
    if (f.type?.startsWith('image/')) {
      setLocalPreview(URL.createObjectURL(f))
    } else {
      setLocalPreview('')
    }
    onFile && onFile(f)
  }, [onFile])
  const parsedAccept = useMemo(()=>{
    const m = {}
    accept.split(',').map(s=>s.trim()).filter(Boolean).forEach(a=> { m[a]=[] })
    return m
  }, [accept])
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ onDrop, multiple: false, accept: parsedAccept })
  const file = acceptedFiles?.[0]

  return (
    <div className="flex items-center gap-4">
      <div {...getRootProps()} className={`flex-1 border-2 border-dashed rounded-md p-4 cursor-pointer ${isDragActive? 'border-sudan-green bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
        <input {...getInputProps()} />
        <div className="text-sm text-gray-600">{isDragActive ? t('upload.drop_here') : t('upload.drag_or_click')}</div>
        {file && !file.type?.startsWith('image/') && (
          <div className="mt-2 text-xs text-gray-700">{t('upload.selected')}: {file.name}</div>
        )}
      </div>
      <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
        {localPreview ? (
          <img src={localPreview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-gray-500">{t('upload.no_preview')}</span>
        )}
      </div>
    </div>
  )
}


