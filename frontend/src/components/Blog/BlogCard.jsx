import React from 'react'
import { Link } from 'react-router-dom'

export default function BlogCard({ blog }) {
  const title = blog.title || 'Untitled'
  const excerpt = blog.excerpt || blog.content?.slice(0, 160)
  const author = blog.author?.fullname || blog.author?.username || 'Unknown'
  const cover = blog.coverImage || blog.cover

  return (
    <article className="glass rounded-lg overflow-hidden transition transform hover:-translate-y-1 hover:shadow-2xl">
      <Link to={`/blog/${blog._id}`} className="flex flex-col md:flex-row items-stretch">
        {cover ? (
          <div className="md:w-44 w-full h-40 md:h-auto flex-shrink-0">
            <img src={cover} alt="cover" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="md:w-44 w-full h-40 md:h-auto bg-zinc-900 flex items-center justify-center text-zinc-400">No image</div>
        )}

        <div className="p-4 flex-1">
          <h3 className="text-lg font-semibold text-indigo-300">{title}</h3>
          <p className="text-sm text-zinc-400 mt-2 line-clamp-3">{excerpt}</p>

          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white">{author.charAt(0).toUpperCase()}</div>
              <div className="text-xs text-zinc-400">{author} • <span className="text-zinc-500">{new Date(blog.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
