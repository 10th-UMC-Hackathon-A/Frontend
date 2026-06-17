import { useState } from 'react';
import { voteApi } from '../api/voteApi';
import { useVoteStore } from '../store/voteStore';
import { usePolling } from './useSocket';

const POLL_INTERVAL_MS = 30_000; // 30초

export const useVote = (roomId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const { myVote, setMyVote, setVoteResults } = useVoteStore();

  const submitVote = async (targetUserId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await voteApi.submitVote(roomId, targetUserId);
      setMyVote(targetUserId);
    } catch (err) {
      setError(err instanceof Error ? err.message : '투표 제출에 실패했습니다');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVoteResults = async () => {
    try {
      const results = await voteApi.getVoteResults(roomId);
      setVoteResults(results);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : '투표 결과를 불러오는 데 실패했습니다');
    }
  };

  // 30초마다 투표 결과 자동 갱신
  usePolling(fetchVoteResults, POLL_INTERVAL_MS, isPolling);

  return {
    myVote,
    isLoading,
    error,
    submitVote,
    fetchVoteResults,
    startPolling: () => setIsPolling(true),
    stopPolling: () => setIsPolling(false),
  };
};
