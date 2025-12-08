import React, { useState } from 'react'
import api from '../../services/axios'
import { useAuth } from '../../contexts/AuthContext'

export default function DislikeButton({ blogId, initial = 0 }){
  const { isAuthenticated } = useAuth()
  const [count, setCount] = useState(initial || 0)

  const dislike = async ()=>{
    if(!isAuthenticated) return alert('Login to dislike')
    try{
      await api.post(`/blogs/${blogId}/dislike`)
      setCount(c=>c+1)
    }catch(e){console.error(e)}
  }

  return (
    <button onClick={dislike} className="px-3 py-1 bg-zinc-800 rounded transition-smooth">
      👎 {count}
    </button>
  )
}
