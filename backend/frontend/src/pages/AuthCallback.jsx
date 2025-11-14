import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AuthCallback() {
  const [status, setStatus] = useState('Verifying login...')
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash parameters from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const access_token = hashParams.get('access_token')
        const refresh_token = hashParams.get('refresh_token')

        if (!access_token) {
          setStatus('Invalid login link')
          setTimeout(() => navigate('/login'), 2000)
          return
        }

        // Verify with backend
        const response = await fetch('http://localhost:3000/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token, refresh_token })
        })

        const data = await response.json()

        if (response.ok) {
          // Store user info and token in localStorage
          localStorage.setItem('token', access_token)
          localStorage.setItem('user', JSON.stringify(data.user))
          
          setStatus('Login successful! Redirecting...')
          setTimeout(() => navigate('/'), 1000)
        } else {
          setStatus('Login failed. Redirecting...')
          setTimeout(() => navigate('/login'), 2000)
        }
      } catch (error) {
        console.error('Callback error:', error)
        setStatus('An error occurred. Redirecting...')
        setTimeout(() => navigate('/login'), 2000)
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h2>{status}</h2>
      <div className="spinner" style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default AuthCallback
