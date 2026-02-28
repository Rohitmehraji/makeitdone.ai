import { createContext, useContext, useState } from 'react'
import api, { setToken } from '../api/client'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState('')

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setAuthToken(data.access_token)
    setToken(data.access_token)
  }

  const register = async ({ email, password, role = 'user', industry = 'general' }) => {
    await api.post('/auth/register', { email, password, role, industry })
  }

  return <AuthContext.Provider value={{ token, login, register }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
