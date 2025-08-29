import { Button } from "@/components/ui/button"
import { PollCard } from "@/components/polls/poll-card"
import Link from "next/link"
import { getPolls, voteOnPoll } from "@/lib/actions/polls"

export default async function PollsPage() {
  const polls = await getPolls()

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
                onVote={voteOnPoll}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}