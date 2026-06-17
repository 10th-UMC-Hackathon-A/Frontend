import { useState } from 'react';
import { voteApi } from '../api/voteApi';
import { useVoteStore } from '../store/voteStore';

export const useVote = (roomId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { selectedUserId, setSelectedUserId, setVoteResults } = useVoteStore();

  const submitVote = async (targetUserId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await voteApi.submitVote(roomId, targetUserId);
      setSelectedUserId(targetUserId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVoteResults = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await voteApi.getVoteResults(roomId);
      setVoteResults(results);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vote results');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedUserId,
    isLoading,
    error,
    submitVote,
    fetchVoteResults,
  };
};
