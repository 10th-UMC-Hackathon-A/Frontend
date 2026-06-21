import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { voteApi } from '../api/voteApi';
import { useVoteStore } from '../store/voteStore';
import { usePolling } from './useSocket';

const POLL_INTERVAL_MS = 3_000; // 3초

export const useVote = (roomId: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const navigate = useNavigate();

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
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const code = err.response?.data?.code as string | undefined;
        const message = err.response?.data?.message as string | undefined;
        console.error('[vote]', status, code, message, err.response?.data);
        if (status === 410 || status === 409) {
          navigate('/progress', { replace: true });
          return;
        }
        // 400: 투표 마감 또는 라운드 전환 중 → 결과 페이지로 이동
        if (status === 400) {
          navigate('/result', { replace: true });
          return;
        }
        setError(`투표 실패 (${status} · ${code ?? message ?? '알 수 없는 오류'})`);
      } else {
        setError('투표 제출에 실패했습니다');
      }
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

  // 3초마다 투표 결과 자동 갱신
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
