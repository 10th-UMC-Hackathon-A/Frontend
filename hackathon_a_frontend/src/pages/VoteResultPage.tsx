import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVote } from '../hooks/useVote';
import { useVoteStore } from '../store/voteStore';
import { useRoomStore } from '../store/roomStore';

const question = 'Q. 지금 강의실 온도 어때요?';

// 다음 정각(:00) 또는 :30까지 남은 초 계산
function getSecondsUntilNextDraw(): number {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const nextMark = minutes < 30 ? 30 : 60;
  return (nextMark - minutes) * 60 - seconds;
}

export default function VoteResultPage() {
  const navigate = useNavigate();
  const { roomId } = useRoomStore();
  const { voteResults } = useVoteStore();
  const { startPolling, stopPolling } = useVote(roomId ?? '');

  const [timeLeft, setTimeLeft] = useState(getSecondsUntilNextDraw);
  const isEnded = timeLeft === 0;

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, []);

  useEffect(() => {
    if (isEnded) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isEnded]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const total = voteResults.reduce((sum, r) => sum + r.voteCount, 0);
  const winner = voteResults.length > 0
    ? voteResults.reduce((a, b) => a.voteCount > b.voteCount ? a : b)
    : null;

  const displayResults = voteResults.length > 0
    ? voteResults
    : [
        { userId: 'a', nickname: '추워요!', voteCount: 0, percentage: 0 },
        { userId: 'b', nickname: '더워요!', voteCount: 0, percentage: 0 },
      ];

  const displayTotal = total > 0 ? total : 0;

  const getBarColor = (idx: number) => {
    if (!isEnded) return 'bg-gray-300';
    return idx === 0 ? 'bg-blue-500' : 'bg-red-400';
  };

  /* ── 투표 진행 중 화면 ── */
  if (!isEnded) {
    return (
      <div className="flex flex-col flex-1 gap-6">
        {/* 상단 뱃지 */}
        <div className="flex justify-center">
          <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
            투표 진행
          </div>
        </div>

        {/* 제목 */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-xl font-bold text-gray-900">투표 진행 중...</p>
          <p className="text-base font-semibold text-blue-500">{question}</p>
          <p className="text-xs text-gray-400">총 {displayTotal}명 참여 · 마감까지 실시간 갱신</p>
        </div>

        {/* 타이머 */}
        <div className="bg-gray-100 rounded-2xl py-5 flex flex-col items-center gap-1">
          <p className="text-sm text-gray-400">남은 시간</p>
          <p className="text-4xl font-black text-gray-900">{formatTime(timeLeft)}</p>
        </div>

        {/* 실시간 결과 바 */}
        <div className="flex flex-col gap-4">
          {displayResults.map((result) => {
            const pct = total > 0 ? Math.round((result.voteCount / total) * 100) : 0;
            return (
              <div key={result.userId} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <span>{result.nickname}</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-400 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 캐릭터 이미지 */}
        <div className="flex justify-center mt-auto">
          <div className="w-28 h-28 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  /* ── 투표 결과 화면 ── */
  return (
    <div className="flex flex-col flex-1 gap-5">
      {/* 상단 뱃지 */}
      <div className="flex justify-center">
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          투표 결과
        </div>
      </div>

      {/* 마감 카운트다운 */}
      <div className="flex flex-col items-center gap-0.5">
        <p className="text-xl font-bold text-gray-900">투표가 마감</p>
        <p className="text-sm text-gray-400">다음 추첨 시작까지</p>
        <p className="text-6xl font-black text-gray-900 mt-2">0</p>
      </div>

      {/* 캐릭터 이미지 */}
      <div className="flex justify-center">
        <div className="w-28 h-28 bg-gray-200 rounded-xl" />
      </div>

      {/* 우승 문구 */}
      {winner && (
        <p className="text-2xl font-black text-gray-900 text-center">
          {winner.nickname}가 이겼어요
        </p>
      )}

      {/* 결과 바 */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-blue-500">{question}</p>
        <p className="text-xs text-gray-400 mb-3">
          총 {displayTotal}명 참여 · {displayResults.map((r) => `${r.nickname} ${r.voteCount}`).join(' / ')}
        </p>
        {displayResults.map((result, idx) => {
          const pct = total > 0 ? Math.round((result.voteCount / total) * 100) : 0;
          return (
            <div key={result.userId} className="flex flex-col gap-1.5 mb-2">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>{result.nickname}</span>
                <span>{pct}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(idx)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate('/final')}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold mt-auto"
      >
        벌칙자를 찾기로 가기
      </button>
    </div>
  );
}
