import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function RegisterForm() {
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { register } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await register({ fullname, username, email, password })
      nav('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto glass p-6 rounded">
      <h2 className="text-xl mb-4">Create account</h2>
      {error && <div className="text-sm text-red-400 mb-2">{error}</div>}
      <input value={fullname} onChange={(e)=>setFullname(e.target.value)} placeholder="Full name" className="w-full p-2 mb-3 bg-transparent border border-zinc-700 rounded" />
      <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className="w-full p-2 mb-3 bg-transparent border border-zinc-700 rounded" />
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 mb-3 bg-transparent border border-zinc-700 rounded" />
      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full p-2 mb-3 bg-transparent border border-zinc-700 rounded" />
      <button className="w-full py-2 bg-indigo-600 rounded text-white">Register</button>
    </form>
  )
}
