import LoginForm from './components/LoginForm'
import RegistrationForm from './components/RegistrationForm'
import ChatPanel from './components/ChatPanel'
import AnalyticsPanel from './components/AnalyticsPanel'
import FeedbackPanel from './components/FeedbackPanel'
import { useAuth } from './context/AuthContext'

const UI_BUILD = 'ui-reg-photo-fix-2026-03-01'
const AGENT_FALLBACK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><rect width='100%' height='100%' fill='%23263f7f'/><text x='50%' y='50%' fill='white' text-anchor='middle' dominant-baseline='middle' font-size='36'>AI Agent</text></svg>"
const CEO_FALLBACK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><rect width='100%' height='100%' fill='%231f6f65'/><text x='50%' y='50%' fill='white' text-anchor='middle' dominant-baseline='middle' font-size='34'>Rohit Mehra</text></svg>"

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
            <p className="build-chip">Build: {UI_BUILD}</p>
          </div>
          <div className="hero-team">
            <TeamCard title="AI Agent" name="MakeItDone Core Agent" img="/images/ai-agent.svg" fallback={AGENT_FALLBACK} />
            <TeamCard title="CEO" name="Rohit Mehra" img="/images/ceo-rohit-mehra.svg" fallback={CEO_FALLBACK} />
          </div>
        </div>
      </section>

      {!token ? (
        <section className="grid auth-grid">
          <div className="panel wide-panel">
            <h2>Secure Agent Access</h2>
            <p className="note">✅ Register is always visible in the right card. Login is in the left card.</p>
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
              <div>• If this text is visible, you are on the latest UI build.</div>
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
