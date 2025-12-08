import React, { useState } from 'react'
import api from '../../services/axios'
import { useAuth } from '../../contexts/AuthContext'

export default function CommentBox({ blogId }){
  const [text, setText] = useState('')
  const { isAuthenticated } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    if(!isAuthenticated) return alert('Login to comment')
    try{
      await api.post(`/blogs/${blogId}/comments`, { content: text })
      setText('')
      // notify listeners to refresh comments
      document.dispatchEvent(new CustomEvent('commentsUpdated', { detail: { blogId } }))
    }catch(e){console.error(e)}
  }

  return (
    <form onSubmit={submit} className="mt-2">
      <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Write a comment..." className="w-full p-2 bg-transparent border border-zinc-700 rounded" />
      <div className="flex justify-end mt-2">
        <button className="px-3 py-1 bg-indigo-600 rounded text-white">Comment</button>
      </div>
    </form>
  )
}
