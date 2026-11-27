import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PlayersProvider } from './context/PlayersContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlayersProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </PlayersProvider>
  </StrictMode>,
)