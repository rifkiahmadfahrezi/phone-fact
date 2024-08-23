import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { AlertProvider } from './context/AlertProvider'

import App from './App'




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <AuthProvider>
            <AlertProvider>
              <Routes>
                <Route path='/*' element={<App/>} />
              </Routes>
            </AlertProvider>
        </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
