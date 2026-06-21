import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useGameStore } from '../store/gameStore';
import { useUserStore } from '../store/userStore';
import { useVoteStore } from '../store/voteStore';
import { useRoomStore } from '../store/roomStore';
import { penaltyApi } from '../api/penaltyApi';
import { roomApi } from '../api/roomApi';
import { usePolling } from '../hooks/useSocket';
import creamYou from '../assets/images/Icon/Cream/You.png';

const ROUND_POLL_INTERVAL_MS = 3_000;
const MISSION_START_KEY = 'missionStartTime';

// 새로고침해도 미션 남은 시간이 5분으로 리셋되지 않도록 시작 시각을 localStorage에 고정한다.
function getMissionTimeLeft(durationSec: number): number {
  let start = Number(localStorage.getItem(MISSION_START_KEY));
  if (!start) {
    start = Date.now();
    localStorage.setItem(MISSION_START_KEY, String(start));
  }
  const elapsed = Math.floor((Date.now() - start) / 1000);
  return Math.max(0, durationSec - elapsed);
}

export default function FinalPage() {
  const navigate = useNavigate();
  const { loserNickname, punishment, punishmentSeconds, winnerVoteLabel, reset: resetGame, setPunishment } = useGameStore();
  const { nickname } = useUserStore();
  const { reset: resetVote } = useVoteStore();
  const { roomId: storeRoomId } = useRoomStore();
  const roomId = storeRoomId ?? (Number(localStorage.getItem('roomId')) || 0);

  const isSelf = !!loserNickname && loserNickname === nickname;
  const displayNickname = loserNickname ?? '알 수 없음';
  // 백엔드는 동작 부분만 내려주므로("손하트를 하며") 프론트가 온도 조절 문구를 붙인다.
  // 더워요가 이기면 에어컨 1도 낮추기, 추워요가 이기면 1도 올리기.
  const acAction = winnerVoteLabel === '추워요' ? '에어컨 1도 올리기' : '에어컨 1도 낮추기';
  // 빈 문자열/공백도 "없음"으로 취급해 미션 텍스트가 비어 보이지 않게 한다.
  const displayMission = punishment?.trim() ? `${punishment} ${acAction}` : '미션 불러오는 중...';

  const totalSeconds = punishmentSeconds || 300;
  const [timeLeft, setTimeLeft] = useState(() => getMissionTimeLeft(punishmentSeconds || 300));
  const isEnded = timeLeft === 0;

  const RADIUS = 104;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const progress = timeLeft / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const FALLBACK_MISSIONS = ['에어컨 1도 올리기', '팔굽혀펴기 10개', '노래 한 소절 부르기', '스쿼트 10개', '앞에 나와서 춤추기'];

  useEffect(() => {
    if (!roomId) return;
    const fallbackMission = () =>
      FALLBACK_MISSIONS[Math.floor(Math.random() * FALLBACK_MISSIONS.length)];
    penaltyApi.drawPenalty(roomId)
      .then((res) => {
        // 서버가 빈 라벨을 주면 랜덤 미션으로 대체 (미션카드 텍스트 누락 방지)
        const label = res.result.label?.trim();
        setPunishment(label ? label : fallbackMission());
      })
      .catch(() => setPunishment(fallbackMission()));
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

  // 한 명이라도 /vote로 넘어가면 모든 참가자가 동시에 따라가도록,
  // 직접 이동(버튼 클릭/내 타이머 종료)과 다른 참가자 감지(라운드 전환 폴링)를 하나로 모은다.
  const navigatedRef = useRef(false);

  const navigateToVote = () => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    localStorage.removeItem('myVote');
    localStorage.removeItem(MISSION_START_KEY);
    localStorage.setItem('roundStartTime', String(Date.now()));
    resetGame();
    resetVote();
    navigate('/vote', { replace: true });
  };

  const goToVote = async () => {
    if (navigatedRef.current) return;
    try {
      if (roomId) await penaltyApi.missionComplete(roomId);
    } catch {
      // 실패해도 다음 라운드로 이동
    }
    navigateToVote();
  };

  useEffect(() => {
    if (!isEnded) return;
    goToVote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnded]);

  // 다른 참가자가 먼저 미션을 완료해 라운드가 넘어갔는지 drawRound로 감지해
  // 전체 참가자를 동시에 /vote로 이동시킨다.
  const baseDrawRoundRef = useRef<number | null>(null);

  const checkRoundAdvanced = async () => {
    if (!roomId || navigatedRef.current) return;
    try {
      const { result } = await roomApi.getRoomDetails(roomId);
      if (baseDrawRoundRef.current === null) {
        baseDrawRoundRef.current = result.drawRound;
        return;
      }
      if (result.drawRound !== baseDrawRoundRef.current) {
        navigateToVote();
      }
    } catch {
      // 폴링 실패는 다음 주기에 재시도
    }
  };

  usePolling(checkRoundAdvanced, ROUND_POLL_INTERVAL_MS, !!roomId);

  return (
    <div className="flex flex-col flex-1 min-h-0 justify-between gap-2">
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

      <div className="bg-blue-500 rounded-2xl px-6 py-[clamp(24px,6svh,64px)] flex flex-col items-center gap-3 text-center">
        <p className="text-blue-200 text-sm">
          {isSelf ? '오늘의 미션' : '벌칙자가 수행 중인 미션'}
        </p>
        <p className="text-white text-2xl font-black leading-tight">{displayMission}</p>
      </div>

      <div className="flex justify-center">
        <div className="relative w-[clamp(190px,30svh,256px)] aspect-square flex items-center justify-center">
          <svg viewBox="0 0 256 256" className="absolute inset-0 w-full h-full">
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

      <Button variant="blue" fullWidth onClick={goToVote} disabled={!isSelf}>
        {isSelf ? '미션 완료' : '미션 진행중..'}
      </Button>
    </div>
  );
}
