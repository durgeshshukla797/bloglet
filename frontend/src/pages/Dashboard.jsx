import React, { useEffect, useState } from 'react'
import api from '../services/axios'
import Sidebar from '../components/Layout/Sidebar'

export default function Dashboard(){
  const [stats, setStats] = useState({ blogs:0, likes:0, comments:0 })

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await api.get('/dashboard/summary')
        setStats(res.data || {})
      }catch(e){console.error(e)}
    }
    load()
  },[])

  return (
    <div className="max-w-6xl mx-auto p-4 md:flex gap-6">
      <Sidebar />
      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass p-4 rounded">Total Blogs<br/><strong className="text-indigo-300">{stats.blogs}</strong></div>
          <div className="glass p-4 rounded">Total Likes<br/><strong className="text-indigo-300">{stats.likes}</strong></div>
          <div className="glass p-4 rounded">Total Comments<br/><strong className="text-indigo-300">{stats.comments}</strong></div>
        </div>
        <div className="glass p-4 rounded">Recent activity feed will appear here.</div>
      </div>
    </div>
  )
}
