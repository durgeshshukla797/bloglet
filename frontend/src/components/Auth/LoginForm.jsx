import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await login({ username, password })
      nav('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto glass p-6 rounded">
      <h2 className="text-xl mb-4">Login</h2>
      {error && <div className="text-sm text-red-400 mb-2">{error}</div>}
      <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className="w-full p-2 mb-3 bg-transparent border border-zinc-700 rounded" />
      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full p-2 mb-3 bg-transparent border border-zinc-700 rounded" />
      <button className="w-full py-2 bg-indigo-600 rounded text-white">Login</button>
      <div className="mt-3 text-sm text-zinc-400 text-center">
        Don't have an account? <a href="/register" className="text-indigo-300 hover:underline">Create one</a>
      </div>
    </form>
  )
}

// adjust submit to send username
