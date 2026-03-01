import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginForm({ defaultEmail = '' }) {
  const { login } = useAuth()
  const [email, setEmail] = useState(defaultEmail)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Login failed. Please verify credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="auth-card stack">
      <h3>Login</h3>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" minLength={8} required />
      <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Enter MakeItDone.ai'}</button>
      {error && <p className="error-text">{error}</p>}
    </form>
  )
}
