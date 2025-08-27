# Polling App

A modern, full-stack polling application built with Next.js, TypeScript, and Tailwind CSS. Create polls, vote on them, and see real-time results.

## Features

- **User Authentication**: Sign up, sign in, and manage user accounts
- **Poll Creation**: Create polls with multiple options and custom settings
- **Voting System**: Vote on polls and see real-time results
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: See votes come in live as people participate

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Authentication pages
│   ├── register/
│   ├── polls/             # Poll-related pages
│   │   ├── page.tsx       # All polls listing
│   │   └── create/        # Create new poll
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── auth/              # Authentication components
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── layout/            # Layout components
│   │   └── navigation.tsx
│   ├── polls/             # Poll-related components
│   │   ├── poll-card.tsx
│   │   └── create-poll-form.tsx
│   └── ui/                # Shadcn UI components
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/                   # Utility functions and API
│   ├── api.ts            # API client functions
│   └── utils.ts          # General utilities
└── types/                # TypeScript type definitions
    └── poll.ts           # Poll-related types
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd polling-app-project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Components

### Authentication
- **LoginForm**: Handles user sign-in with email and password
- **RegisterForm**: New user registration with validation
- **Navigation**: Shows different options based on auth state

### Polls
- **PollCard**: Displays individual polls with voting functionality
- **CreatePollForm**: Form for creating new polls with multiple options
- **PollsPage**: Lists all available polls with search/filter options

### UI Components
Built with Shadcn UI components for consistent design:
- Button variants (default, outline, ghost, etc.)
- Card layouts for content organization
- Input fields with proper styling
- Responsive design patterns

## API Integration

The app includes a complete API client (`src/lib/api.ts`) with functions for:

- **Authentication**: login, register, logout, getCurrentUser
- **Polls**: getAll, getById, create, vote, delete, getUserPolls
- **Utilities**: token management, authentication state

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: High-quality component library
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Tailored for polling functionality

## TypeScript

Full TypeScript support with defined interfaces for:
- Poll and PollOption structures
- User and authentication data
- API request/response types
- Component props

## Next Steps

### Backend Development
1. Set up a Node.js/Express API server
2. Implement authentication with JWT
3. Create database models for users and polls
4. Add real-time features with WebSockets

### Additional Features
1. **Poll Analytics**: Charts and statistics
2. **Poll Sharing**: Social media integration
3. **User Profiles**: Poll history and preferences
4. **Categories**: Organize polls by topics
5. **Search & Filter**: Find polls easily
6. **Notifications**: Real-time updates

### Deployment
1. Deploy frontend to Vercel/Netlify
2. Set up backend hosting (Railway, Heroku, etc.)
3. Configure environment variables
4. Set up database (PostgreSQL, MongoDB)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
