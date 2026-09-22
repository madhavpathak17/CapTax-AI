import { createContext, useContext, useState } from 'react'
import { loginUser, registerUser } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  const register = async (userData) => {
    return await registerUser(userData)
  }

  const login = async (userData) => {
    const data = await loginUser(userData)

    setToken(data.access_token)
    setUser(data.user)

    localStorage.setItem('captax_token', data.access_token)
    localStorage.setItem('captax_user', JSON.stringify(data.user))

    return data
  }

  const logout = () => {
    setToken(null)
    setUser(null)

    localStorage.removeItem('captax_token')
    localStorage.removeItem('captax_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}