import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/axios'
import Cookies from 'js-cookie'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (credentials) => {
    // server expects { username, password }
    const payload = {
      username: credentials.username || credentials.email || '',
      password: credentials.password
    }
    const res = await api.post('/users/login', payload)
    if (res?.data?.user) {
      setUser(res.data.user)
      setIsAuthenticated(true)
      // store minimal info for quick restore
      localStorage.setItem('bloglet_user', JSON.stringify(res.data.user))
    }
    return res
  }

  const register = async (payload) => {
    // server expects { fullname, username, email, password }
    const body = {
      fullname: payload.fullname || payload.name || '',
      username: payload.username || payload.name || '',
      email: payload.email,
      password: payload.password
    }
    const res = await api.post('/users/register', body)
    return res
  }

  const logout = async () => {
    try {
      await api.post('/users/logout')
    } catch (e) {
      // ignore
    }
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('bloglet_user')
    Cookies.remove('token')
  }

  const refreshAuth = async () => {
    setLoading(true)
    try {
      // endpoint expects POST /users/refreshtoken and reads cookie; use POST to match backend
      const res = await api.post('/users/refreshtoken')
      if (res?.data?.user) {
        setUser(res.data.user)
        setIsAuthenticated(true)
        localStorage.setItem('bloglet_user', JSON.stringify(res.data.user))
      } else {
        const stored = localStorage.getItem('bloglet_user')
        if (stored) setUser(JSON.parse(stored))
      }
    } catch (err) {
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout, refreshAuth, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
