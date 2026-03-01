import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function RegistrationForm({ defaultIndustry = 'general' }) {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [industry, setIndustry] = useState(defaultIndustry)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await register({ email, password, industry })
      setSuccess('Registration complete. Now use Login column.')
      setEmail('')
      setPassword('')
      setIndustry(defaultIndustry)
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-card stack">
      <h3>Register</h3>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 8 chars)" minLength={8} required />
      <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Industry (healthcare, finance...)" />
      <button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
      {success && <p className="ok-text">{success}</p>}
      {error && <p className="error-text">{error}</p>}
    </form>
  )
}
