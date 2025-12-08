import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-indigo-300">404</h1>
      <p className="text-zinc-400 mt-2">Page not found</p>
      <Link to="/" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded">Go home</Link>
    </div>
  )
}
