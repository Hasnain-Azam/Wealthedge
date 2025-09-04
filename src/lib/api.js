import axios from 'axios';
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export function apiClient(token) {
  return axios.create({
    baseURL: '/api',
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
}

export function useApi() {
  const { token } = useAuth();
  return useMemo(() => apiClient(token), [token]);
}
