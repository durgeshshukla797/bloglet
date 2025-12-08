import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const ddRef = useRef()

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    nav('/login')
  }

  useEffect(() => {
    const onDoc = (e) => {
      if (!ddRef.current) return
      if (!ddRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const displayName = user?.fullname || user?.username || ''

  return (
    <nav className="w-full glass border-b border-zinc-800 overflow-visible">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between overflow-visible">
        <Link to="/" className="text-xl font-semibold text-indigo-400">Bloglet</Link>
        <div className="flex items-center gap-4">
          <Link to="/blogs" className="text-sm text-zinc-300 hover:text-indigo-300 transition-smooth">Blogs</Link>
          <Link to="/about" className="text-sm text-zinc-300 hover:text-indigo-300 transition-smooth">About</Link>

          {isAuthenticated ? (
            <div className="relative" ref={ddRef}>
              <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-1 bg-zinc-900/40 hover:bg-zinc-900 rounded"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold text-white">{(displayName || 'U').charAt(0).toUpperCase()}</div>
                <div className="text-sm text-zinc-200">{displayName || 'User'}</div>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-zinc-900/80 border border-zinc-800 rounded shadow-lg z-[9999]">
                  <Link to="/my-blogs" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800">My Posts</Link>
                  <Link to="/profile" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800">Profile</Link>
                  <div className="border-t border-zinc-800" />
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-zinc-800">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 bg-indigo-600 text-white rounded">Login</Link>
              <Link to="/register" className="ml-2 px-3 py-1 border border-zinc-700 rounded text-sm text-zinc-200 hover:bg-zinc-900 transition-smooth">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
