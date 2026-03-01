import LoginForm from './components/LoginForm'
import RegistrationForm from './components/RegistrationForm'
import ChatPanel from './components/ChatPanel'
import AnalyticsPanel from './components/AnalyticsPanel'
import FeedbackPanel from './components/FeedbackPanel'
import { useAuth } from './context/AuthContext'

function TeamCard({ title, name, img }) {
  return (
    <article className="team-card">
      <img src={img} alt={name} />
      <div>
        <h4>{title}</h4>
        <p>{name}</p>
      </div>
    </article>
  )
}

export default function App() {
  const { token } = useAuth()

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
            <TeamCard title="AI Agent" name="MakeItDone Core Agent" img="/images/ai-agent.svg" />
            <TeamCard title="CEO" name="Rohit Mehra" img="/images/ceo-rohit-mehra.svg" />
          </div>
        </div>
      </section>

      {!token ? (
        <section className="grid auth-grid">
          <div className="panel wide-panel">
            <h2>Secure Agent Access</h2>
            <p className="note">Register first in the right column, then login in the left column.</p>

            <div className="auth-columns">
              <LoginForm />
              <RegistrationForm />
            </div>
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
