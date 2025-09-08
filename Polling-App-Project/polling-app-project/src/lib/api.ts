import { Poll, CreatePollData, VoteData, AuthResponse, User } from "@/types/poll"

const API_BASE_URL = typeof window === 'undefined' ? 'http://localhost:3000/api' : '/api'

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
}


