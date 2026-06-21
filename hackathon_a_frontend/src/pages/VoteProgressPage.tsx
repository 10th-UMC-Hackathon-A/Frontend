import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../components/common/ProgressBar';
import { useVote } from '../hooks/useVote';
import { useVoteStore } from '../store/voteStore';
import { useRoomStore } from '../store/roomStore';
import { roomApi } from '../api/roomApi';
import creamThinking from '../assets/images/Icon/Cream/Thinking.png';

const question = 'Q. 지금 강의실 온도 어때요?';

// 투표 시간 2분. 서버 voteClosedAt 조회 실패 시에만 쓰는 fallback.
const VOTE_DURATION_SEC = 120;

function getFallbackSeconds(): number {
  const roundStart = Number(localStorage.getItem('roundStartTime'));
  if (roundStart) {
    const elapsed = Math.floor((Date.now() - roundStart) / 1000);
    return Math.max(0, VOTE_DURATION_SEC - elapsed);
  }
  return VOTE_DURATION_SEC;
}

export default function VoteProgressPage() {
  const navigate = useNavigate();
  const { roomId: storeRoomId } = useRoomStore();
  const roomId = storeRoomId ?? (Number(localStorage.getItem('roomId')) || 0);
  const { voteResults } = useVoteStore();
  const { startPolling, stopPolling } = useVote(roomId);

  // null = 아직 voteClosedAt 미확인. 확인 전에는 결과 화면으로 보내지 않는다.
  // roomId가 없으면 서버 조회가 불가하므로 즉시 fallback 값으로 시작.
  const [timeLeft, setTimeLeft] = useState<number | null>(() =>
    roomId ? null : getFallbackSeconds()
  );

  useEffect(() => {
    startPolling();
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // voteClosedAt 기준으로 타이머 동기화 (조회 실패 시에만 fallback 사용)
  useEffect(() => {
    if (!roomId) return;
    roomApi
      .getRoomDetails(roomId)
      .then((res) => {
        const closedAt = new Date(res.result.voteClosedAt).getTime();
        const remaining = Math.max(5, Math.ceil((closedAt - Date.now()) / 1000));
        setTimeLeft(remaining);
      })
      .catch(() => setTimeLeft(getFallbackSeconds()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timeLeft === null) return; // voteClosedAt 확인 전엔 대기

    if (timeLeft === 0) {
      navigate('/result');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const total = voteResults.reduce((sum, r) => sum + r.count, 0);

  const displayResults =
    voteResults.length > 0
      ? voteResults
      : [
          { label: '추워요', count: 0 },
          { label: '더워요', count: 0 },
        ];

  return (
    <main className="flex flex-col flex-1">
      {/* 배지 */}
      <div className="flex justify-center">
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          투표 진행
        </div>
      </div>

      {/* 제목 */}
      <section className="flex flex-col items-center gap-1 mt-[clamp(16px,3svh,32px)]">
        <p className="text-2xl font-bold text-gray-900">투표 진행 중...</p>
        <p className="text-xl font-bold text-gray-500 text-center">{question}</p>
        <p className="text-sm text-gray-400">총 {total}명 참여 · 마감까지 실시간 갱신</p>
      </section>

      {/* 타이머 카드 */}
      <section className="w-full max-w-[330px] self-center bg-gray-100 rounded-2xl py-[clamp(14px,2.5svh,22px)] flex flex-col items-center gap-1 mt-[clamp(20px,4svh,44px)]">
        <p className="text-base text-gray-400 font-medium">남은 시간</p>
        <p className="text-5xl font-black text-gray-900 tracking-tight">
          {timeLeft === null ? '--:--' : formatTime(timeLeft)}
        </p>
      </section>

      {/* 투표 바 */}
      <section className="flex flex-col gap-3 mt-[clamp(16px,3svh,28px)]">
        {displayResults.map((result) => {
          const percentage = total > 0 ? Math.round((result.count / total) * 100) : 0;
          return (
            <ProgressBar
              key={result.label}
              value={percentage}
              label={result.label}
              barClassName={result.label === '추워요' ? 'bg-blue-400' : 'bg-red-400'}
            />
          );
        })}
      </section>

      {/* 크림 캐릭터 */}
      <div className="flex justify-center mt-[clamp(16px,4svh,40px)]">
        <img
          src={creamThinking}
          alt="크림 캐릭터"
          className="w-[clamp(120px,21svh,180px)] h-auto aspect-square object-contain"
        />
      </div>
    </main>
  );
}
