import { useEffect, useState } from 'react'
import { auth } from '../lib/firebase'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

export default function AdminLogin({ onAuthed }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (user)=>{ if (user) onAuthed(user) })
    return () => unsub()
  }, [onAuthed])

  async function submit(e){
    e.preventDefault()
    setError('')
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const token = await cred.user.getIdToken()
      localStorage.setItem('fbToken', token)
      onAuthed(cred.user)
    } catch (e) {
      setError('Login failed. Check email/password and enable Email/Password in Firebase Auth.')
    }
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-sudan-black mb-6">Admin Login</h1>
      <form onSubmit={submit} className="bg-white rounded-lg shadow-sm p-6 max-w-md space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <button className="bg-sudan-green text-white px-6 py-2 rounded hover:bg-green-700 w-full">Login</button>
      </form>
    </main>
  )
}


