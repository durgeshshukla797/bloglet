import React, { useState } from 'react'
import api from '../../services/axios'
import { useNavigate } from 'react-router-dom'
import CoverImageUploader from './CoverImageUploader'

export default function CreateBlogForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', title)
      fd.append('content', content)
      if (file) fd.append('coverImage', file)

      await api.post('/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      nav('/my-blogs')
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="glass p-6 rounded max-w-3xl mx-auto">
      <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full mb-3 p-2 bg-transparent border border-zinc-700 rounded" />
      <textarea value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Content (Markdown allowed)" className="w-full mb-3 p-2 bg-transparent border border-zinc-700 rounded h-48" />
      <CoverImageUploader onFileSelect={(f)=>setFile(f)} />
      <button disabled={loading} className="mt-4 px-4 py-2 bg-indigo-600 rounded text-white">{loading ? 'Creating...' : 'Create Blog'}</button>
    </form>
  )
}
