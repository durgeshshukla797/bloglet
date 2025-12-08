import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/axios'
import LikeButton from '../Interactions/LikeButton'
import DislikeButton from '../Interactions/DislikeButton'
import CommentList from '../Interactions/CommentList'
import CommentBox from '../Interactions/CommentBox'

export default function BlogDetails(){
  const { id } = useParams()
  const [blog, setBlog] = useState(null)

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await api.get(`/blogs/${id}`)
        setBlog(res.data.blog || res.data)
      }catch(e){console.error(e)}
    }
    load()
  },[id])

  if(!blog) return <div className="text-center text-zinc-500">Loading...</div>

  return (
    <article className="glass p-6 rounded">
      {(blog.coverImage || blog.cover) && (
        <img src={blog.coverImage || blog.cover} alt="cover" className="w-full rounded mb-4 object-cover" />
      )}
      <h1 className="text-2xl font-bold text-indigo-300">{blog.title}</h1>
      <div className="text-sm text-zinc-500 mb-4">By {blog.author?.fullname || blog.author?.username} • {new Date(blog.createdAt).toLocaleString()}</div>
      <div className="prose prose-invert text-zinc-100">{blog.content}</div>
      <div className="mt-4 flex gap-3">
        <LikeButton blogId={id} initial={blog.likes} />
        <DislikeButton blogId={id} initial={blog.dislikes} />
      </div>
      <section className="mt-6">
        <CommentBox blogId={id} />
        <CommentList blogId={id} />
      </section>
    </article>
  )
}
