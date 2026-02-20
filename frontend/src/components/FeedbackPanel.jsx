import { useState } from 'react'
import api from '../api/client'

export default function FeedbackPanel() {
  const [sessionId, setSessionId] = useState('')
  const [rating, setRating] = useState(5)
  const [comments, setComments] = useState('')
  const [status, setStatus] = useState('')

  const submit = async () => {
    await api.post('/feedback', { session_id: Number(sessionId), rating, comments })
    setStatus('Thanks! Feedback recorded for continuous learning.')
  }

  return (
    <section>
      <h2>Feedback Intelligence Loop</h2>
      <p className="note">Capture human preference signals to improve future agent behavior.</p>
      <div className="stack">
        <input value={sessionId} onChange={(e) => setSessionId(e.target.value)} placeholder="Session ID" />
        <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
        <textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Tell us what to improve..." />
        <button onClick={submit}>Submit Learning Signal</button>
      </div>
      {status && <p className="note">{status}</p>}
    </section>
  )
}
