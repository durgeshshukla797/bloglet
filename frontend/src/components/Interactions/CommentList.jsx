import React, { useEffect, useState } from 'react'
import api from '../../services/axios'

export default function CommentList({ blogId }){
  const [comments, setComments] = useState([])

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await api.get(`/blogs/${blogId}/comments`)
        setComments(res.data.comments || [])
      }catch(e){console.error(e)}
    }
    load()
    const onUpdate = (e) => { if (e?.detail?.blogId === blogId) load() }
    document.addEventListener('commentsUpdated', onUpdate)
    return () => document.removeEventListener('commentsUpdated', onUpdate)
  },[blogId])

  if(!comments.length) return <div className="text-zinc-500 mt-3">No comments yet.</div>

  return (
    <ul className="mt-3 space-y-3">
      {comments.map(c=> (
        <li key={c._id} className="glass p-3 rounded">
          <div className="text-sm text-zinc-300">{c.owner?.username || c.owner?.fullname || 'Anonymous'}</div>
          <div className="text-zinc-200 mt-1">{c.content}</div>
          <div className="text-xs text-zinc-500 mt-1">{new Date(c.createdAt).toLocaleString()}</div>
        </li>
      ))}
    </ul>
  )
}
