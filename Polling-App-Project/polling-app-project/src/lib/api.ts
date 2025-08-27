import { Poll, CreatePollData, VoteData, AuthResponse, User } from "@/types/poll"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    throw new ApiError(response.status, `API request failed: ${response.statusText}`)
  }

  return response.json()
}

// Authentication API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
  },

  logout: async (): Promise<void> => {
    return apiRequest<void>('/auth/logout', {
      method: 'POST',
    })
  },

  getCurrentUser: async (): Promise<User> => {
    return apiRequest<User>('/auth/me')
  },
}

// Polls API
export const pollsApi = {
  getAll: async (): Promise<Poll[]> => {
    return apiRequest<Poll[]>('/polls')
  },

  getById: async (id: string): Promise<Poll> => {
    return apiRequest<Poll>(`/polls/${id}`)
  },

  create: async (pollData: CreatePollData): Promise<Poll> => {
    return apiRequest<Poll>('/polls', {
      method: 'POST',
      body: JSON.stringify(pollData),
    })
  },

  vote: async (voteData: VoteData): Promise<Poll> => {
    return apiRequest<Poll>('/polls/vote', {
      method: 'POST',
      body: JSON.stringify(voteData),
    })
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/polls/${id}`, {
      method: 'DELETE',
    })
  },

  getUserPolls: async (): Promise<Poll[]> => {
    return apiRequest<Poll[]>('/polls/my-polls')
  },
}

// Utility functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token)
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken')
}

export const removeAuthToken = () => {
  localStorage.removeItem('authToken')
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}
