"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PollOption {
  id: string
  text: string
  votes: number
}

interface Poll {
  id: string
  title: string
  description: string
  options: PollOption[]
  totalVotes: number
  createdAt: string
  createdBy: string
  isActive: boolean
}

import { pollsApi } from "@/lib/api"

export function PollCard({ poll }: { poll: Poll }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = async () => {
    if (selectedOption) {
      const result = await pollsApi.vote({ pollId: poll.id, optionId: selectedOption })
      if (result) {
        setHasVoted(true)
      } else {
        console.error("Error voting:")
      }
    }
  }

  const getVotePercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0
    return Math.round((votes / poll.totalVotes) * 100)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {poll.title}
          <span className={`text-xs px-2 py-1 rounded-full ${
            poll.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {poll.isActive ? 'Active' : 'Closed'}
          </span>
        </CardTitle>
        <CardDescription>{poll.description}</CardDescription>
        <div className="text-xs text-gray-500">
          Created by {poll.createdBy} • {new Date(poll.createdAt).toLocaleDateString()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {poll.options.map((option) => (
            <div key={option.id} className="relative">
              <button
                onClick={() => !hasVoted && setSelectedOption(option.id)}
                className={`w-full p-3 text-left border rounded-lg transition-colors ${
                  selectedOption === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${hasVoted ? 'cursor-default' : 'cursor-pointer'}`}
                disabled={hasVoted}
              >
                <div className="flex justify-between items-center">
                  <span>{option.text}</span>
                  <span className="text-sm font-medium">
                    {option.votes} votes ({getVotePercentage(option.votes)}%)
                  </span>
                </div>
                {hasVoted && (
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${getVotePercentage(option.votes)}%` }}
                    />
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
        
        {!hasVoted && selectedOption && (
          <Button onClick={handleVote} className="w-full">
            Vote
          </Button>
        )}
        
        {hasVoted && (
          <div className="text-center text-sm text-green-600 font-medium">
            ✓ You have voted on this poll
          </div>
        )}
        
        <div className="text-center text-sm text-gray-500">
          Total votes: {poll.totalVotes}
        </div>
      </CardContent>
    </Card>
  )
}
