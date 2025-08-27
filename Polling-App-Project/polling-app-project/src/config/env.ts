export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
  auth: {
    tokenKey: 'authToken',
    expiresIn: '7d',
  },
  app: {
    name: 'Polling App',
    description: 'Create and vote on polls with ease',
  },
} as const
