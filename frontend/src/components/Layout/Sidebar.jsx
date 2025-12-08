import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="w-64 p-4 glass rounded-md hidden md:block">
      <nav className="flex flex-col gap-2">
        <Link to="/my-blogs" className="text-sm text-zinc-200">My Blogs</Link>
        <Link to="/create" className="text-sm text-zinc-200">Create Blog</Link>
        <Link to="/profile" className="text-sm text-zinc-200">Profile</Link>
      </nav>
    </aside>
  )
}
