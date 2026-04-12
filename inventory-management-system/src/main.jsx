import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   // ✅ ADD THIS
import './index.css'
import App from './App.jsx'
import MainApp from './Mainapp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>   {/* ✅ WRAP APP */}
      <MainApp />
    </BrowserRouter>
  </StrictMode>
)