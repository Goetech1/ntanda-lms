import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TenantBrandingProvider } from './components/TenantBrandingProvider.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TenantBrandingProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </TenantBrandingProvider>
  </StrictMode>,
)
