import { useState } from 'react'
import LoginForm from './components/LoginForm'
import RegistrationForm from './components/RegistrationForm'
import ChatPanel from './components/ChatPanel'
import AnalyticsPanel from './components/AnalyticsPanel'
import FeedbackPanel from './components/FeedbackPanel'
import { useAuth } from './context/AuthContext'

function TeamCard({ title, name, img, fallback }) {
  return (
    <article className="team-card">
      <img src={img} alt={name} onError={(e) => { e.currentTarget.src = fallback }} />
      <div>
        <h4>{title}</h4>
        <p>{name}</p>
      </div>
    </article>
  )
}

const FALLBACK_AGENT = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="%23121d38"/><text x="50%" y="50%" fill="%23c6d8ff" font-size="26" text-anchor="middle" dominant-baseline="middle">AI Agent</text></svg>'
const FALLBACK_CEO = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="%23172f2f"/><text x="50%" y="50%" fill="%23d9fff6" font-size="24" text-anchor="middle" dominant-baseline="middle">Rohit Mehra</text></svg>'

export default function App() {
  const { token } = useAuth()
  const [authScreen, setAuthScreen] = useState('login')
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [authNotice, setAuthNotice] = useState('')

  const handleRegistered = (email) => {
    setRegisteredEmail(email)
    setAuthNotice('Registration successful. Please login with your new account.')
    setAuthScreen('login')
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="brand-row">
          <div>
            <div className="brand">MakeItDone<span>.ai</span></div>
            <p className="tagline">
              Build a comprehensive AI agent platform. Ultra-modern multi-domain orchestration,
              explainable intelligence, and feedback-powered optimization.
            </p>
          </div>
          <div className="hero-team">
            <TeamCard title="AI Agent" name="MakeItDone Core Agent" img="/images/ai-agent.jpg" fallback={FALLBACK_AGENT} />
            <TeamCard title="CEO" name="Rohit Mehra" img="/images/ceo-rohit-mehra.jpg" fallback={FALLBACK_CEO} />
          </div>
        </div>
      </section>

      {!token ? (
        <section className="grid auth-grid">
          <div className="panel wide-panel">
            <h2>Secure Agent Access</h2>
            <p className="note">Use Register to create an account, then switch to Login.</p>

            <div className="auth-switch">
              <button type="button" className={authScreen === 'login' ? 'tab active' : 'tab'} onClick={() => setAuthScreen('login')}>Login</button>
              <button type="button" className={authScreen === 'register' ? 'tab active' : 'tab'} onClick={() => setAuthScreen('register')}>Register</button>
            </div>

            {authNotice && <p className="ok-text">{authNotice}</p>}

            {authScreen === 'login' ? (
              <LoginForm defaultEmail={registeredEmail} />
            ) : (
              <RegistrationForm onRegistered={handleRegistered} />
            )}
          </div>
          <div className="panel">
            <h2>Platform Highlights</h2>
            <div className="stack note">
              <div>• Natural language understanding + multi-turn memory</div>
              <div>• Domain-specific workflows for healthcare, finance, sales, and support</div>
              <div>• Explainability trace + sentiment + cost telemetry</div>
              <div>• Continuous learning from structured user feedback</div>
              <div>• Full-page responsive dashboard layout (desktop + mobile)</div>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid app-grid">
          <div className="stack">
            <div className="panel"><ChatPanel /></div>
            <div className="panel"><FeedbackPanel /></div>
          </div>
          <div className="panel"><AnalyticsPanel /></div>
        </section>
      )}
    </main>
  )
}
