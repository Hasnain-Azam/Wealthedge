import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import usePageTitle from './hooks/usePageTitle.jsx'

function Protected({ children }) {
  const { token, hydrated } = useAuth()
  if (!hydrated) return null
  return token ? children : <Navigate to="/login" replace />
}

function PublicOnly({ children }) {
  const { token, hydrated } = useAuth()
  if (!hydrated) return null
  return token ? <Navigate to="/" replace /> : children
}

function TitleController() {
  usePageTitle()
  return null
}

export default function App() {
  return (
    <AuthProvider>
      {/* Always-on title controller */}
      <TitleController />

      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnly>
              <Register />
            </PublicOnly>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
