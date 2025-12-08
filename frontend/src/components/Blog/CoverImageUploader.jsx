import React, { useEffect, useState } from 'react'

export default function CoverImageUploader({ onFileSelect, initialPreview }){
  const [preview, setPreview] = useState(initialPreview || '')

  useEffect(()=>{
    setPreview(initialPreview || '')
  },[initialPreview])

  const handle = (e)=>{
    const file = e.target.files[0]
    if(!file) return
    setPreview(URL.createObjectURL(file))
    if(onFileSelect) onFileSelect(file)
  }

  return (
    <div className="mb-3">
      {preview && <img src={preview} alt="preview" className="w-full h-48 object-cover rounded mb-2" />}
      <input type="file" accept="image/*" onChange={handle} />
    </div>
  )
}
