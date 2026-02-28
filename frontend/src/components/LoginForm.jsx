import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginForm() {
  const { login, register } = useAuth()
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regIndustry, setRegIndustry] = useState('general')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)
  const [loadingRegister, setLoadingRegister] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoadingLogin(true)
    try {
      await login(loginEmail, loginPassword)
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Login failed. Please verify credentials.')
    } finally {
      setLoadingLogin(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoadingRegister(true)
    try {
      await register({ email: regEmail, password: regPassword, industry: regIndustry })
      setMessage('Registration successful. Use the login column to sign in.')
      setRegEmail('')
      setRegPassword('')
      setRegIndustry('general')
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Registration failed. Please try again.')
    } finally {
      setLoadingRegister(false)
    }
  }

  return (
    <div className="auth-columns">
      <form onSubmit={handleLogin} className="auth-card stack">
        <h3>Login</h3>
        <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" minLength={8} required />
        <button type="submit" disabled={loadingLogin}>{loadingLogin ? 'Signing in...' : 'Enter MakeItDone.ai'}</button>
      </form>

      <form onSubmit={handleRegister} className="auth-card stack">
        <h3>Register</h3>
        <input value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Password (min 8 chars)" minLength={8} required />
        <input value={regIndustry} onChange={(e) => setRegIndustry(e.target.value)} placeholder="Industry (healthcare, finance...)" />
        <button type="submit" disabled={loadingRegister}>{loadingRegister ? 'Creating account...' : 'Create Account'}</button>
      </form>

      {message && <p className="ok-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}
