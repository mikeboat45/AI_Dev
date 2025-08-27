import { CreatePollForm } from "@/components/polls/create-poll-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CreatePollPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Poll</h1>
            <p className="mt-2 text-gray-600">
              Create a new poll and share it with others
            </p>
          </div>
          <Link href="/polls">
            <Button variant="outline">Back to Polls</Button>
          </Link>
        </div>
        
        <CreatePollForm />
      </div>
    </div>
  )
}
