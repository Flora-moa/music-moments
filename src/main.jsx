import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 启动日志：让黑屏变成“有字的黑屏”，一眼定位原因
const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML =
    '<p style="color:#191613;padding:2rem;font-family:monospace">[music-moments] #root not found</p>'
} else {
  try {
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    console.log('[music-moments] React mounted')
  } catch (err) {
    rootEl.innerHTML = `<pre style="color:#191613;padding:2rem;white-space:pre-wrap;font-family:monospace">[music-moments] mount failed\n${err?.message}\n${err?.stack}</pre>`
    console.error('[music-moments] mount failed', err)
  }
}
