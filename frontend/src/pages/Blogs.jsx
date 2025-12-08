import React, { useEffect, useState } from 'react'
import api from '../services/axios'
import BlogList from '../components/Blog/BlogList'

export default function Blogs(){
  const [blogs, setBlogs] = useState([])
  useEffect(()=>{
    const load = async ()=>{
      try{ const res = await api.get('/blogs/public'); setBlogs(res.data.blogs || res.data || []) }catch(e){console.error(e)}
    }
    load()
  },[])

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 text-indigo-300">All Blogs</h2>
      <BlogList blogs={blogs} />
    </section>
  )
}
