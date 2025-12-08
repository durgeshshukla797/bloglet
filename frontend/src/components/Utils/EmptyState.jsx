import React from 'react'

export default function EmptyState({ title='Nothing here', subtitle='' }){
  return (
    <div className="glass p-8 rounded text-center">
      <h3 className="text-lg text-zinc-200">{title}</h3>
      {subtitle && <p className="text-sm text-zinc-400 mt-2">{subtitle}</p>}
    </div>
  )
}
