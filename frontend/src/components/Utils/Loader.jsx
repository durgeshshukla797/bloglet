import React from 'react'

export default function Loader(){
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-10 h-10 rounded-full border-4 border-zinc-700 border-t-indigo-500 animate-spin" />
    </div>
  )
}
