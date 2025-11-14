import './LoginPage.css'
import { useState } from 'react'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href="/" 
    }
  }

  const handleMagicLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (!email) {
      setError('Please enter your email')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:3000/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Magic link sent! Check your email to log in.')
        setEmail('')
      } else {
        setError(data.error || 'Failed to send magic link')
      }
    } catch (err) {
      console.error('Magic link error:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <section className="login-hero">
        <div className="login-container">
          <h1>Log in</h1>
          <p>Enter your email to receive a magic link</p>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          <form className="login-form" onSubmit={handleMagicLink}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required 
              />
            </div>
            <button 
              className="login-button" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
            <button className='back-button' type="button" onClick={goBack}>Back</button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default LoginPage