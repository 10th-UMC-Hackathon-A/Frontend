import { useState } from 'react';
import { voteApi } from '../api/voteApi';
import { useVoteStore } from '../store/voteStore';
import { usePolling } from './useSocket';

const POLL_INTERVAL_MS = 30_000; // 30초

export const useVote = (roomId: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const { myVote, setMyVote, setVoteResults } = useVoteStore();

  const submitVote = async (position: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await voteApi.submitVote(roomId, position);
      localStorage.setItem('myVote', position);
      setMyVote(position);
      setVoteResults(result.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '투표 제출에 실패했습니다');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVoteResults = async () => {
    try {
      const result = await voteApi.getVoteStatus(roomId);
      setVoteResults(result.result);
      return result.result;
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
