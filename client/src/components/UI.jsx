import { Toaster } from 'react-hot-toast'

export function PageToaster(){
  return <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
}

export function Field({ label, children }){
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      {children}
    </div>
  )
}

export function TextInput(props){
  return <input className="w-full border rounded px-3 py-2" {...props} />
}

export function TextArea(props){
  return <textarea className="w-full border rounded px-3 py-2" {...props} />
}

export function Button({ className='', ...props }){
  return <button className={`px-4 py-2 rounded bg-sudan-green text-white hover:bg-green-700 ${className}`} {...props} />
}


