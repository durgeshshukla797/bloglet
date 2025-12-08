import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/axios'
import BlogList from '../components/Blog/BlogList'

export default function MyBlogs(){
  const [blogs, setBlogs] = useState([])
  useEffect(()=>{
    const load = async ()=>{
      try{ const res = await api.get('/blogs'); setBlogs(res.data.blogs || res.data || []) }catch(e){console.error(e)}
    }
    load()
  },[])

  return (
    <div className="relative">
      <h2 className="text-2xl text-indigo-300 mb-4">My Blogs</h2>
      <BlogList blogs={blogs} />

      <Link to="/create" className="fixed right-6 bottom-24 z-[9999]">
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg">+ Create</button>
      </Link>
    </div>
  )
}
