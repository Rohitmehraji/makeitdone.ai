import { useState } from 'react'
import api from '../api/client'

export default function ChatPanel() {
  const [sessionId, setSessionId] = useState(null)
  const [domain, setDomain] = useState('healthcare')
  const [workflow, setWorkflow] = useState('support')
  const [message, setMessage] = useState('')
  const [chatLog, setChatLog] = useState([])

  const createSession = async () => {
    const { data } = await api.post('/sessions', { domain, workflow })
    setSessionId(data.id)
  }

  const send = async () => {
    if (!sessionId || !message.trim()) return
    const prompt = message
    const { data } = await api.post('/chat', { session_id: sessionId, message: prompt })
    setChatLog((prev) => [...prev, { q: prompt, a: data.reply, explainability: data.explainability }])
    setMessage('')
  }

  return (
    <section>
      <h2>AI Conversation Studio</h2>
      <div className="row">
        <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Domain" />
        <input value={workflow} onChange={(e) => setWorkflow(e.target.value)} placeholder="Workflow" />
      </div>
      <div style={{ marginTop: 10 }}>
        <button onClick={createSession}>Start Context Session</button>
        <span className="note" style={{ marginLeft: 10 }}>
          {sessionId ? `Session #${sessionId} active` : 'No active session'}
        </span>
      </div>
      <div className="stack" style={{ marginTop: 10 }}>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask anything..." />
        <button onClick={send}>Generate Response</button>
      </div>
      <div className="chatlog" style={{ marginTop: 12 }}>
        {chatLog.map((entry, idx) => (
          <article key={idx} className="bubble">
            <p><b>You:</b> {entry.q}</p>
            <p><b>Agent:</b> {entry.a}</p>
            <small className="note">Explainability: {entry.explainability.reason}</small>
          </article>
        ))}
      </div>
    </section>
  )
}
