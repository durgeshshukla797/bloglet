import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Blogs from '../pages/Blogs'
import BlogPage from '../pages/BlogPage'
import About from '../pages/About'
import Create from '../pages/Create'
import MyBlogs from '../pages/MyBlogs'
import EditBlog from '../pages/EditBlog'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import NotFound from '../pages/NotFound'
import { useAuth } from '../contexts/AuthContext'

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.28 }}
    className="p-6 max-w-6xl mx-auto"
  >
    {children}
  </motion.div>
)

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <PageWrapper><div>Checking auth...</div></PageWrapper>
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/blogs" element={<PageWrapper><Blogs /></PageWrapper>} />
        <Route path="/blog/:id" element={<PageWrapper><BlogPage /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />

        <Route path="/create" element={<ProtectedRoute><PageWrapper><Create /></PageWrapper></ProtectedRoute>} />
        <Route path="/my-blogs" element={<ProtectedRoute><PageWrapper><MyBlogs /></PageWrapper></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><PageWrapper><EditBlog /></PageWrapper></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageWrapper><Settings /></PageWrapper></ProtectedRoute>} />

        <Route path="/404" element={<PageWrapper><NotFound /></PageWrapper>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
