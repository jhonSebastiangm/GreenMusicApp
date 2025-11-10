import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, token });
  },
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    set({ user: null, token: null });
  },
}));

// Load from localStorage on init
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('authToken');
  const storedUser = localStorage.getItem('user');
  if (storedToken && storedUser) {
    useAuthStore.getState().setAuth(JSON.parse(storedUser), storedToken);
  }
}

