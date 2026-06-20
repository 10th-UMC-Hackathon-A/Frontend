import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useUserStore } from '../store/userStore';
import { useVoteStore } from '../store/voteStore';

export default function FinalPage() {
  const navigate = useNavigate();
  const { loserNickname, punishment, punishmentSeconds, reset: resetGame } = useGameStore();
  const { nickname } = useUserStore();
  const { reset: resetVote } = useVoteStore();

  const isSelf = !!loserNickname && loserNickname === nickname;
  const displayNickname = loserNickname ?? '알 수 없음';
  const displayMission = punishment ?? '미션 정보 없음';

  const [timeLeft, setTimeLeft] = useState(() => punishmentSeconds);
  const isEnded = timeLeft === 0;

  useEffect(() => {
    if (isEnded) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isEnded]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m} : ${String(s).padStart(2, '0')}`;
  };

  const goToVote = () => {
    localStorage.removeItem('myVote');
    resetGame();
    resetVote();
    navigate('/vote', { replace: true });
  };

  // 타이머 종료 후 자동 이동
  useEffect(() => {
    if (!isEnded) return;
    goToVote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnded]);

  return (
    <div className="flex flex-col flex-1 justify-between gap-3">
      <div className="flex justify-center">
        <div
          className={[
            'text-sm font-semibold px-5 py-2 rounded-full',
            isSelf ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500',
          ].join(' ')}
        >
          {isSelf ? '본인이 벌칙자!' : '미션 관전 중'}
        </div>
      </div>

      <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-5">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
        <div>
          <p className="text-base font-bold text-gray-900">
            {isSelf ? displayNickname : `${displayNickname} 님이 미션 수행 중`}
          </p>
          <p className="text-xs text-gray-400">이번 라운드 벌칙자</p>
        </div>
      </div>

      <div className="bg-blue-500 rounded-2xl px-5 py-6 flex flex-col items-center gap-2 text-center">
        <p className="text-blue-200 text-sm">
          {isSelf ? '오늘의 미션' : '벌칙자가 수행 중인 미션'}
        </p>
        <p className="text-white text-2xl font-black leading-tight">{displayMission}</p>
      </div>

      <div className="flex justify-center">
        <div className="w-52 h-52 rounded-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-center">
          <p className="text-4xl font-black text-blue-500">{formatTime(timeLeft)}</p>
        </div>
      </div>

      <button
        onClick={goToVote}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold cursor-pointer hover:bg-blue-400 transition"
      >
        미션 완료
      </button>
    </div>
  );
}
