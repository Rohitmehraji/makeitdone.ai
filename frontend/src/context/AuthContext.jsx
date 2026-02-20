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

  return <AuthContext.Provider value={{ token, login }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
