import LoginForm from './components/LoginForm'
import ChatPanel from './components/ChatPanel'
import AnalyticsPanel from './components/AnalyticsPanel'
import FeedbackPanel from './components/FeedbackPanel'
import { useAuth } from './context/AuthContext'

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
        </div>
      </section>

      {!token ? (
        <section className="grid">
          <div className="panel">
            <h2>Secure Agent Access</h2>
            <p className="note">Enterprise-ready authentication with role-aware operations.</p>
            <LoginForm />
          </div>
          <div className="panel">
            <h2>Platform Highlights</h2>
            <div className="stack note">
              <div>• Natural language understanding + multi-turn memory</div>
              <div>• Domain-specific workflows for healthcare, finance, sales, and support</div>
              <div>• Explainability trace + sentiment + cost telemetry</div>
              <div>• Continuous learning from structured user feedback</div>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid">
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
