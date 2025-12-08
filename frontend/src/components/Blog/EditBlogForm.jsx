import React, { useEffect, useState } from 'react'
import api from '../../services/axios'
import { useNavigate, useParams } from 'react-router-dom'
import CoverImageUploader from './CoverImageUploader'

export default function EditBlogForm(){
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await api.get(`/blogs/${id}`)
        const b = res.data.blog || res.data
        setTitle(b.title)
        setContent(b.content)
        setCoverPreview(b.coverImage || b.cover || '')
      }catch(e){console.error(e)}
    }
    load()
  },[id])

  const submit = async(e)=>{
    e.preventDefault(); setLoading(true)
    try{
      const fd = new FormData()
      fd.append('title', title)
      fd.append('content', content)
      if (file) fd.append('coverImage', file)

      await api.put(`/blogs/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      nav('/my-blogs')
    }catch(e){console.error(e)}
    finally{setLoading(false)}
  }

  return (
    <form onSubmit={submit} className="glass p-6 rounded max-w-3xl mx-auto">
      <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full mb-3 p-2 bg-transparent border border-zinc-700 rounded" />
      <textarea value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Content" className="w-full mb-3 p-2 bg-transparent border border-zinc-700 rounded h-48" />
      <CoverImageUploader onFileSelect={(f)=>setFile(f)} initialPreview={coverPreview} />
      <button className="mt-4 px-4 py-2 bg-indigo-600 rounded text-white">{loading? 'Saving...' : 'Save Changes'}</button>
    </form>
  )
}
