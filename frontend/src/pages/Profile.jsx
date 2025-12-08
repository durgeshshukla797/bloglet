import React, { useEffect, useState } from 'react'
import api from '../services/axios'
import { useAuth } from '../contexts/AuthContext'

export default function Profile(){
  const { user } = useAuth()
  const [profile, setProfile] = useState(user)

  useEffect(()=>{
    const load = async ()=>{
      try{ const res = await api.get('/user/me'); setProfile(res.data) }catch(e){console.error(e)}
    }
    if(!profile) load()
  },[profile])

  if(!profile) return <div>Loading...</div>
  return (
    <div className="glass p-6 rounded max-w-2xl mx-auto">
      <h2 className="text-xl text-indigo-300">{profile.name}</h2>
      <div className="text-sm text-zinc-400">{profile.email}</div>
    </div>
  )
}
