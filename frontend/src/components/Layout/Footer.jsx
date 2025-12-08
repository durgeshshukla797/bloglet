import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full mt-8 py-6 border-t border-zinc-800 glass relative z-0">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-zinc-500">© {new Date().getFullYear()} Bloglet — Built with ❤️</div>
    </footer>
  )
}
