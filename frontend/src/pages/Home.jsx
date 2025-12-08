import React, { useEffect, useState } from 'react'
import api from '../services/axios'
import BlogList from '../components/Blog/BlogList'
import { useAuth } from '../contexts/AuthContext'

export default function Home(){
  const [blogs, setBlogs] = useState([])
  const { isAuthenticated } = useAuth()

  useEffect(()=>{
    const load = async ()=>{
      try{
        const path = isAuthenticated ? '/blogs' : '/blogs/public'
        const res = await api.get(path)
        setBlogs(res.data.blogs || res.data || [])
      }catch(e){console.error(e)}
    }
    load()
  },[isAuthenticated])

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 text-indigo-300">All Blogs</h2>
      <BlogList blogs={blogs} />
    </section>
  )
}
