import apiClient from '@/lib/api-client'

interface LoginRequest {
  email: string
  password: string
}

interface SignupRequest {
  name: string
  email: string
  password: string
}

interface AuthResponse {
  access_token: string
  refresh_token: string
  user: {
    id: number
    name: string
    email: string
    avatar_url?: string
    created_at: string
  }
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data)
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },
}
