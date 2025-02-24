import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import { RedirectPage } from './RedirectPage'

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/redirect/:qrId" element={<RedirectPage />} />
      </Routes>
    </Router>
  </StrictMode>,
)
