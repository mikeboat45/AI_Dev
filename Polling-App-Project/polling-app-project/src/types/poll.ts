export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface Poll {
  id: string
  title: string
  description: string
  options: PollOption[]
  totalVotes: number
  createdAt: string
  createdBy: { id: string; name: string; }
  isActive: boolean
  expiresAt?: string
  allowMultipleVotes?: boolean
  isPublic?: boolean
}

export interface CreatePollData {
  title: string
  description: string
  options: { text: string }[]
  expiresAt?: string
  allowMultipleVotes?: boolean
  isPublic?: boolean
}

export interface VoteData {
  pollId: string
  optionId: string
  userId?: string
}

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}
