import React from 'react'
import ReactDOM from 'react-dom/client'
import Modal from 'react-modal'
import App from './App.jsx'
import './index.css'

// Set the app element for react-modal
Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
