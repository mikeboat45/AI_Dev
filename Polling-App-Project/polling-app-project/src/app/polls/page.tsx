"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PollCard } from "@/components/polls/poll-card"
import Link from "next/link"

// Mock data for demonstration
const mockPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Let's see which programming language is most popular among developers",
    options: [
      { id: "1-1", text: "JavaScript", votes: 45 },
      { id: "1-2", text: "Python", votes: 38 },
      { id: "1-3", text: "TypeScript", votes: 32 },
      { id: "1-4", text: "Rust", votes: 15 }
    ],
    totalVotes: 130,
    createdAt: "2024-01-15T10:00:00Z",
    createdBy: "John Doe",
    isActive: true
  },
  {
    id: "2",
    title: "Best framework for building web apps?",
    description: "Which framework do you prefer for modern web development?",
    options: [
      { id: "2-1", text: "React", votes: 52 },
      { id: "2-2", text: "Vue", votes: 28 },
      { id: "2-3", text: "Angular", votes: 20 },
      { id: "2-4", text: "Svelte", votes: 12 }
    ],
    totalVotes: 112,
    createdAt: "2024-01-14T15:30:00Z",
    createdBy: "Jane Smith",
    isActive: true
  },
  {
    id: "3",
    title: "Team lunch preference",
    description: "Where should we go for the team lunch this Friday?",
    options: [
      { id: "3-1", text: "Italian Restaurant", votes: 8 },
      { id: "3-2", text: "Sushi Bar", votes: 12 },
      { id: "3-3", text: "Pizza Place", votes: 6 },
      { id: "3-4", text: "Thai Food", votes: 4 }
    ],
    totalVotes: 30,
    createdAt: "2024-01-13T09:15:00Z",
    createdBy: "Mike Johnson",
    isActive: false
  }
]

export default function PollsPage() {
  const [polls, setPolls] = useState(mockPolls)

  const handleVote = (pollId: string, optionId: string) => {
    // TODO: Implement actual voting logic with API call
    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map(option => 
              option.id === optionId 
                ? { ...option, votes: option.votes + 1 }
                : option
            ),
            totalVotes: poll.totalVotes + 1
          }
        }
        return poll
      })
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Polls</h1>
            <p className="mt-2 text-gray-600">
              Browse and vote on polls created by the community
            </p>
          </div>
          <Link href="/polls/create">
            <Button>Create New Poll</Button>
          </Link>
        </div>

        <div className="space-y-6">
          {polls.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No polls available
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to create a poll!
              </p>
              <Link href="/polls/create">
                <Button>Create Your First Poll</Button>
              </Link>
            </div>
          ) : (
            polls.map(poll => (
              <PollCard 
                key={poll.id} 
                poll={poll} 
                onVote={handleVote}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
