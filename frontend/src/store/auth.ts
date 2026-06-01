import { create } from 'zustand'

interface User {
  id: number
  name: string
  email: string
  avatar_url?: string
  created_at: string
}

interface AuthStore {
  user: User | null
  access_token: string | null
  refresh_token: string | null
  isLoggedIn: boolean
  setUser: (user: User) => void
  setTokens: (access: string, refresh: string) => void
  logout: () => void
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  access_token: null,
  refresh_token: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: true }),
  setTokens: (access_token, refresh_token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
    }
    set({ access_token, refresh_token })
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
    set({ user: null, access_token: null, refresh_token: null, isLoggedIn: false })
  },
  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      const access_token = localStorage.getItem('access_token')
      const refresh_token = localStorage.getItem('refresh_token')
      const user = localStorage.getItem('user')
      set({
        access_token,
        refresh_token,
        user: user ? JSON.parse(user) : null,
        isLoggedIn: !!access_token,
      })
    }
  },
}))
