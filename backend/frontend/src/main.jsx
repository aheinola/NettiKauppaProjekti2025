import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'  // Import the main App with routing

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />  {/* App already includes BrowserRouter */}
  </StrictMode>
)
