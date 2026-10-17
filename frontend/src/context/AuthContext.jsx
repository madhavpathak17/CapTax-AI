import { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser } from '../services/api'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const stored = localStorage.getItem('captax_user')
    return stored ? JSON.parse(stored) : null
  } catch {
    localStorage.removeItem('captax_user')
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('captax_token'))
  const [user, setUser] = useState(() => readStoredUser())

  useEffect(() => {
    const handleSessionExpired = () => {
      setToken(null)
      setUser(null)
      localStorage.removeItem('captax_token')
      localStorage.removeItem('captax_user')
    }

    window.addEventListener('captax:session-expired', handleSessionExpired)
    return () => window.removeEventListener('captax:session-expired', handleSessionExpired)
  }, [])

  const register = async (userData) => registerUser(userData)

  const login = async (userData) => {
    const data = await loginUser(userData)

    if (!data?.access_token) {
      throw new Error('The server did not return an access token.')
    }

    const receivedUser = data.user || { email: userData.email }
    const candidateName = [receivedUser.name, receivedUser.full_name, receivedUser.username]
      .find((value) => typeof value === 'string' && value.trim() && !['string', 'null', 'undefined', 'name', 'user'].includes(value.trim().toLowerCase()))
    const normalizedUser = {
      ...receivedUser,
      name: candidateName || (receivedUser.email || userData.email || '').split('@')[0] || 'Account',
    }

    setToken(data.access_token)
    setUser(normalizedUser)
    localStorage.setItem('captax_token', data.access_token)
    localStorage.setItem('captax_user', JSON.stringify(normalizedUser))

    return data
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('captax_token')
    localStorage.removeItem('captax_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, isAuthenticated: Boolean(token) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }
  return context
}
