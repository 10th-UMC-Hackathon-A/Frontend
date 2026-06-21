import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useUserStore } from '../store/userStore';
import { useVoteStore } from '../store/voteStore';
import { useRoomStore } from '../store/roomStore';
import { penaltyApi } from '../api/penaltyApi';
import creamYou from '../assets/images/Icon/Cream/You.png';

export default function FinalPage() {
  const navigate = useNavigate();
  const { loserNickname, punishment, punishmentSeconds, reset: resetGame, setPunishment } = useGameStore();
  const { nickname } = useUserStore();
  const { reset: resetVote } = useVoteStore();
  const { roomId: storeRoomId } = useRoomStore();
  const roomId = storeRoomId ?? (Number(localStorage.getItem('roomId')) || 0);

  const isSelf = !!loserNickname && loserNickname === nickname;
  const displayNickname = loserNickname ?? '알 수 없음';
  const displayMission = punishment ?? '미션 불러오는 중...';

  const totalSeconds = punishmentSeconds || 1;
  const [timeLeft, setTimeLeft] = useState(() => punishmentSeconds);
  const isEnded = timeLeft === 0;

  const RADIUS = 104;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const progress = timeLeft / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const FALLBACK_MISSIONS = ['에어컨 1도 올리기', '팔굽혀펴기 10개', '노래 한 소절 부르기', '스쿼트 10개', '앞에 나와서 춤추기'];

  useEffect(() => {
    if (!roomId) return;
    penaltyApi.drawPenalty(roomId)
      .then((res) => setPunishment(res.result.label))
      .catch(() => {
        const fallback = FALLBACK_MISSIONS[Math.floor(Math.random() * FALLBACK_MISSIONS.length)];
        setPunishment(fallback);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return `${m} : ${String(s).padStart(2, '0')}`;
  };

  const goToVote = async () => {
    try {
      if (roomId) await penaltyApi.missionComplete(roomId);
    } catch {
      // 실패해도 다음 라운드로 이동
    }
    localStorage.removeItem('myVote');
    localStorage.setItem('roundStartTime', String(Date.now()));
    resetGame();
    resetVote();
    navigate('/vote', { replace: true });
  };

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

      <div className="flex items-center gap-3 bg-blue-50/50 border border-blue-200 rounded-2xl px-4 py-4">
        <div className="w-16 h-16 shrink-0 bg-white border-2 border-blue-100 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
          <img
            src={creamYou}
            alt="벌칙자 프로필"
            className="w-full h-full object-contain scale-[1.3] translate-y-2"
          />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">
            {isSelf ? displayNickname : `${displayNickname} 님이 미션 수행 중`}
          </p>
          <p className="text-xs text-gray-400">이번 라운드 벌칙자</p>
        </div>
      </div>

      <div className="bg-blue-500 rounded-2xl px-6 py-16 flex flex-col items-center gap-3 text-center -mt-2">
        <p className="text-blue-200 text-sm">
          {isSelf ? '오늘의 미션' : '벌칙자가 수행 중인 미션'}
        </p>
        <p className="text-white text-2xl font-black leading-tight">{displayMission}</p>
      </div>

      <div className="flex justify-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg width="256" height="256" className="absolute inset-0">
            <defs>
              <linearGradient id="timerGradient" gradientUnits="userSpaceOnUse" x1="128" y1="0" x2="128" y2="256">
                <stop offset="0%" stopColor="#1e40af" />
                <stop offset="100%" stopColor="#93c5fd" />
              </linearGradient>
              <filter id="timerGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="128" cy="128" r={RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <g transform="translate(128,128) rotate(90) scale(-1,1) translate(-128,-128)">
              <circle
                cx="128" cy="128" r={RADIUS}
                fill="none"
                stroke="url(#timerGradient)"
                strokeWidth="10"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                filter="url(#timerGlow)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </g>
          </svg>
          <p className="text-4xl font-black text-blue-500 z-10">{formatTime(timeLeft)}</p>
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
