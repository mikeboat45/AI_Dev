'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { pollsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { deletePollAction } from '@/lib/actions/polls';
import type { Poll } from '@/types/poll';

export function PollCard({ poll }: { poll: Poll }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formattedEndsAt, setFormattedEndsAt] = useState('');
  const [formattedCreatedAt, setFormattedCreatedAt] = useState('');
  const { session, loading } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isOwner = session?.user?.id === poll.createdBy.id;

  useEffect(() => {
    setFormattedCreatedAt(new Date(poll.createdAt).toLocaleDateString());
    if (poll.expiresAt) {
      setFormattedEndsAt(new Date(poll.expiresAt).toLocaleDateString());
    }
  }, [poll.createdAt, poll.expiresAt]);

  const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date();

  const handleVote = async () => {
    if (selectedOption && !isExpired && session) {
      try {
        const result = await pollsApi.vote({
          pollId: poll.id,
          optionId: selectedOption,
        });
        if (result) {
          setHasVoted(true);
          router.refresh();
        } else {
          setError('Failed to vote. Please try again.');
        }
      } catch (error: any) {
        setError(error.message || 'An unexpected error occurred.');
      }
    }
  };

  const handleDelete = async () => {
    if (!isOwner) return;

    const confirmed = window.confirm('Are you sure you want to delete this poll?');
    if (confirmed) {
      startTransition(async () => {
        const result = await deletePollAction(poll.id);
        if (result?.error) {
          setError(result.error);
        } else {
          router.refresh();
        }
      });
    }
  };

  const getVotePercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <CardTitle className="flex items-center justify-between">
              {poll.title}
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  !isExpired
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {!isExpired ? 'Active' : 'Closed'}
              </span>
            </CardTitle>
            <CardDescription>{poll.description}</CardDescription>
            <div className="text-xs text-gray-500 pt-1">
              Created by {poll.createdBy.name} • {formattedCreatedAt}
              {formattedEndsAt && <span> • Closes on {formattedEndsAt}</span>}
            </div>
          </div>
          {!loading && isOwner && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
              className="ml-4 flex-shrink-0"
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="space-y-2">
          {poll.options.map((option) => (
            <div key={option.id} className="relative">
              <button
                onClick={() =>
                  !hasVoted && !isExpired && setSelectedOption(option.id)
                }
                className={`w-full p-3 text-left border rounded-lg transition-colors ${
                  selectedOption === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${
                  hasVoted || isExpired ? 'cursor-default' : 'cursor-pointer'
                }`}
                disabled={hasVoted || isExpired}
              >
                <div className="flex justify-between items-center">
                  <span>{option.text}</span>
                  <span className="text-sm font-medium">
                    {option.votes} votes ({getVotePercentage(option.votes)}%)
                  </span>
                </div>
                {(hasVoted || isExpired) && (
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

        {!hasVoted && !isExpired && selectedOption && (
          <Button onClick={handleVote} className="w-full">
            Vote
          </Button>
        )}

        {hasVoted && (
          <div className="text-center text-sm text-green-600 font-medium">
            ✓ You have voted on this poll
          </div>
        )}

        {isExpired && !hasVoted && (
          <div className="text-center text-sm text-red-600 font-medium">
            This poll has closed and is no longer accepting votes.
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          Total votes: {poll.totalVotes}
        </div>
      </CardContent>
    </Card>
  );
}
