import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginForm() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [industry, setIndustry] = useState('general')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register({ email, password, industry })
        setMessage('Registration successful. Please log in with your new account.')
        setMode('login')
      }
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : `${mode === 'login' ? 'Login' : 'Registration'} failed. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="stack">
      <div className="segmented">
        <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
        <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
      </div>

      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 8 chars)" minLength={8} required />

      {mode === 'register' && (
        <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Industry (e.g. healthcare, finance)" />
      )}

      <button type="submit" disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Enter MakeItDone.ai' : 'Create Account'}</button>

      {message && <p style={{ color: '#8effd8', margin: 0 }}>{message}</p>}
      {error && <p style={{ color: '#ff9db4', margin: 0 }}>{error}</p>}
    </form>
  )
}
