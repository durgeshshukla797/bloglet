import React from 'react'
import BlogCard from './BlogCard'

export default function BlogList({ blogs = [] }) {
  if (!blogs.length) return <div className="text-center text-zinc-500">No blogs yet.</div>
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map(b => <BlogCard key={b._id} blog={b} />)}
    </div>
  )
}
