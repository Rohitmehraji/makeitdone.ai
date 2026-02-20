import { useState } from 'react'
import api from '../api/client'

export default function AnalyticsPanel() {
  const [stats, setStats] = useState(null)

  const load = async () => {
    const { data } = await api.get('/analytics')
    setStats(data)
  }

  return (
    <section>
      <h2>AI Ops Analytics</h2>
      <p className="note">Monitor volume, quality, and cost efficiency in real time.</p>
      <button onClick={load}>Refresh Analytics</button>
      {stats && (
        <div className="kpi" style={{ marginTop: 12 }}>
          <div className="kpi-card"><b>Sessions</b><div>{stats.total_sessions}</div></div>
          <div className="kpi-card"><b>Messages</b><div>{stats.total_messages}</div></div>
          <div className="kpi-card"><b>Avg Feedback</b><div>{stats.average_feedback_rating}</div></div>
          <div className="kpi-card"><b>Total Cost (¢)</b><div>{stats.estimated_total_cost_cents}</div></div>
        </div>
      )}
    </section>
  )
}
