import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';

export default function App() {
  const { token } = useAuth();
  return token ? <Dashboard /> : <Login />;
}
