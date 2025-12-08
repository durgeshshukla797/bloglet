import React, { useState } from 'react'
import api from '../../services/axios'
import { useAuth } from '../../contexts/AuthContext'

export default function LikeButton({ blogId, initial = 0 }){
  const { isAuthenticated } = useAuth()
  const [count, setCount] = useState(initial || 0)

  const like = async ()=>{
    if(!isAuthenticated) return alert('Login to like')
    try{
      await api.post(`/blogs/${blogId}/like`)
      setCount(c=>c+1)
    }catch(e){console.error(e)}
  }

  return (
    <button onClick={like} className="px-3 py-1 bg-zinc-800 rounded transition-smooth">
      ❤️ {count}
    </button>
  )
}
