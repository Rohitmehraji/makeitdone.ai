import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin1234')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
    } catch {
      setError('Login failed. Register an account via API first, then retry.')
    }
  }

  return (
    <form onSubmit={submit} className="stack">
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Enter MakeItDone.ai</button>
      {error && <p style={{ color: '#ff9db4', margin: 0 }}>{error}</p>}
    </form>
  )
}
