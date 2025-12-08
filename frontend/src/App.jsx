import React from 'react'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import AppRoutes from './routes/AppRoutes'
import Toast from './components/Utils/Toast'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-zinc-200">
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
      <Toast />
    </div>
  )
}
