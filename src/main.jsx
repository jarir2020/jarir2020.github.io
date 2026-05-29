import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import Alpine from 'alpinejs'
window.Alpine = Alpine
Alpine.start()

// SPA redirect handoff from 404.html (GitHub Pages deep-link refresh)
;(function handleSpaRedirect() {
  const params = new URLSearchParams(window.location.search)
  const redirect = params.get('spa-redirect')
  if (redirect) {
    window.history.replaceState(null, '', redirect)
  }
})()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
