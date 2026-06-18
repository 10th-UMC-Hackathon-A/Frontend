import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVote } from '../hooks/useVote';
import { useVoteStore } from '../store/voteStore';
import { useRoomStore } from '../store/roomStore';

const question = 'Q. 지금 사무실 온도는 어때요?';

export default function VoteResultPage() {
  const navigate = useNavigate();
  const { roomId } = useRoomStore();
  const { voteResults } = useVoteStore();
  const { startPolling, stopPolling } = useVote(roomId ?? 0);

  useEffect(() => {
    startPolling();
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = voteResults.reduce((sum, r) => sum + r.count, 0);
  const winner = voteResults.length > 0
    ? voteResults.reduce((a, b) => a.count > b.count ? a : b)
    : null;

  const displayResults = voteResults.length > 0
    ? voteResults
    : [
        { label: '추워요!', count: 5 },
        { label: '더워요!', count: 3 },
      ];

  const displayTotal = total > 0 ? total : 8;

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-900">투표 결과</h2>
          <p className="text-base text-gray-700 mt-2">{question}</p>
        </div>

        <div className="flex flex-col gap-5 mt-2">
          {displayResults.map((result, idx) => {
            const percentage = total > 0
              ? Math.round((result.count / total) * 100)
              : Math.round((result.count / displayTotal) * 100);
            const isWinner = winner ? result.label === winner.label : idx === 0;

            return (
              <div key={result.label} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">{result.label}</span>
                  <span className="text-sm font-bold text-gray-800">{percentage}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isWinner ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">{result.count}명이 투표했어요</p>
              </div>
            );
          })}
        </div>

        <p className="text-sm text-gray-500 text-center mt-2">
          총 {displayTotal}명 참여 · {displayResults.map((r) => `${r.label} ${r.count}`).join(' / ')}
        </p>

        {winner && (
          <p className="text-xs text-gray-400 text-center">
            이 중({winner.label})에서 벌칙자를 골라올게요
          </p>
        )}
      </div>

      <button
        onClick={() => navigate('/final')}
        className="w-full bg-gray-800 text-white py-4 rounded-xl text-sm font-medium"
      >
        벌칙자를 찾기로 가기
      </button>
    </div>
  );
}
