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
  const { startPolling, stopPolling } = useVote(roomId ?? '');

  useEffect(() => {
    startPolling(); // 페이지 진입 시 30초 폴링 시작
    return () => stopPolling(); // 페이지 이탈 시 폴링 중지
  }, []);

  const total = voteResults.reduce((sum, r) => sum + r.voteCount, 0);
  const winner = voteResults.length > 0
    ? voteResults.reduce((a, b) => a.voteCount > b.voteCount ? a : b)
    : null;

  // 결과가 없으면 mock 데이터로 UI 표시
  const displayResults = voteResults.length > 0
    ? voteResults
    : [
        { userId: 'a', nickname: '추워요!', voteCount: 5, percentage: 62 },
        { userId: 'b', nickname: '더워요!', voteCount: 3, percentage: 38 },
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
              ? Math.round((result.voteCount / total) * 100)
              : result.percentage ?? 0;
            const isWinner = winner
              ? result.userId === winner.userId
              : idx === 0;

            return (
              <div key={result.userId} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">{result.nickname}</span>
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
                <p className="text-xs text-gray-400">{result.voteCount}명이 투표했어요</p>
              </div>
            );
          })}
        </div>

        <p className="text-sm text-gray-500 text-center mt-2">
          총 {displayTotal}명 참여 · {displayResults.map((r) => `${r.nickname} ${r.voteCount}`).join(' / ')}
        </p>

        {winner && (
          <p className="text-xs text-gray-400 text-center">
            이 중({winner.nickname})에서 벌칙자를 골라올게요
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
