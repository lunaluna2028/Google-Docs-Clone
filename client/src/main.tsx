//앱 실행 시작점. 브라우저에서 앱을 시작작

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { AdminProvider } from './context/AdminContext'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminProvider> {/* ✅ App 전체를 감쌈 */}
      <App />
    </AdminProvider>
  </React.StrictMode>,
)
