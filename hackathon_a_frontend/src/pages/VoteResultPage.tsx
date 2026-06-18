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
  const { startPolling, stopPolling } = useVote(roomId ?? 0);

  const [timeLeft, setTimeLeft] = useState(getSecondsUntilNextDraw);
  const isEnded = timeLeft === 0;

  useEffect(() => {
    startPolling();

    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEnded]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;

    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const total = voteResults.reduce((sum, result) => sum + result.count, 0);

  const winner =
    voteResults.length > 0
      ? voteResults.reduce((a, b) => (a.count > b.count ? a : b))
      : null;

  const displayResults =
    voteResults.length > 0
      ? voteResults
      : [
          { label: '추워요!', count: 0 },
          { label: '더워요!', count: 0 },
        ];

  const displayTotal = total;

  const getBarColor = (idx: number) => {
    if (!isEnded) return 'bg-gray-400';
    return idx === 0 ? 'bg-blue-500' : 'bg-red-400';
  };

  if (!isEnded) {
    return (
      <main className="flex flex-col flex-1 gap-6">
        <div className="flex justify-center">
          <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
            투표 진행
          </div>
        </div>

        <section className="flex flex-col items-center gap-1">
          <p className="text-xl font-bold text-gray-900">투표 진행 중...</p>
          <p className="text-base font-semibold text-blue-500">{question}</p>
          <p className="text-xs text-gray-400">
            총 {displayTotal}명 참여 · 마감까지 실시간 갱신
          </p>
        </section>

        <section className="bg-gray-100 rounded-2xl py-5 flex flex-col items-center gap-1">
          <p className="text-sm text-gray-400">남은 시간</p>
          <p className="text-4xl font-black text-gray-900">{formatTime(timeLeft)}</p>
        </section>

        <section className="flex flex-col gap-4">
          {displayResults.map((result, idx) => {
            const percentage = total > 0 ? Math.round((result.count / total) * 100) : 0;

            return (
              <div key={result.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <span>{result.label}</span>
                  <span>{percentage}%</span>
                </div>

                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getBarColor(idx)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className="text-xs text-gray-400">{result.count}명이 투표했어요</p>
              </div>
            );
          })}
        </section>

        <div className="flex justify-center mt-auto">
          <div className="w-28 h-28 bg-gray-200 rounded-xl" aria-hidden="true" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 gap-5">
      <div className="flex justify-center">
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          투표 결과
        </div>
      </div>

      <section className="flex flex-col items-center gap-0.5">
        <p className="text-xl font-bold text-gray-900">투표가 마감되었습니다</p>
        <p className="text-sm text-gray-400">다음 추첨 시작까지</p>
        <p className="text-6xl font-black text-gray-900 mt-2">0</p>
      </section>

      <div className="flex justify-center">
        <div className="w-28 h-28 bg-gray-200 rounded-xl" aria-hidden="true" />
      </div>

      {winner && (
        <>
          <p className="text-2xl font-black text-gray-900 text-center">
            {winner.label}가 이겼어요
          </p>

          <p className="text-xs text-gray-400 text-center">
            이 중({winner.label})에서 벌칙자를 골라올게요
          </p>
        </>
      )}

      <section className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-blue-500">{question}</p>

        <p className="text-xs text-gray-400 mb-3">
          총 {displayTotal}명 참여 ·{' '}
          {displayResults.map((result) => `${result.label} ${result.count}`).join(' / ')}
        </p>

        {displayResults.map((result, idx) => {
          const percentage = total > 0 ? Math.round((result.count / total) * 100) : 0;

          return (
            <div key={result.label} className="flex flex-col gap-1.5 mb-2">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>{result.label}</span>
                <span>{percentage}%</span>
              </div>

              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(idx)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>

      <button
        onClick={() => navigate('/final')}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold mt-auto"
      >
        벌칙자를 찾기로 가기
      </button>
    </main>
  );
}
