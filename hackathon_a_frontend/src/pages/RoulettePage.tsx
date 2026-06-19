import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { useGameStore } from '../store/gameStore';

const DUMMY_PARTICIPANTS = [
  { id: 'd1', nickname: '김철수' },
  { id: 'd2', nickname: '이영희' },
  { id: 'd3', nickname: '박민준' },
  { id: 'd4', nickname: '최서연' },
  { id: 'd5', nickname: '정도현' },
];

const DUMMY_MISSIONS = ['에어컨 1도 조절하기', '팔굽혀펴기 10개', '노래 한 소절 부르기'];

const SPIN_DURATION = 3000;

export default function RoulettePage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [isResult, setIsResult] = useState(false);
  const navigate = useNavigate();

  const { participants } = useRoomStore();
  const { setLoser, setPunishment, loserNickname } = useGameStore();

  const pool =
    participants.length > 0
      ? participants.map((p) => ({ id: p.id, nickname: p.nickname }))
      : DUMMY_PARTICIPANTS;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // eslint-disable-next-line react-hooks/purity
    const loserIdx = Math.floor(Math.random() * pool.length);
    const loser = pool[loserIdx];
    // eslint-disable-next-line react-hooks/purity
    const mission = DUMMY_MISSIONS[Math.floor(Math.random() * DUMMY_MISSIONS.length)];

    let speed = 80;
    let elapsed = 0;
    let current = 0;

    const tick = () => {
      current = (current + 1) % pool.length;
      setHighlightIndex(current);
      elapsed += speed;

      if (elapsed >= SPIN_DURATION - 500) {
        speed = Math.min(speed + 40, 400);
      }

      if (elapsed >= SPIN_DURATION) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setHighlightIndex(loserIdx);
        setLoser(loser.id, loser.nickname);
        setPunishment(mission);
        setTimeout(() => {
          setIsSpinning(false);
          setIsResult(true);
        }, 800);
        return;
      }

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setTimeout(tick, speed);
    };

    intervalRef.current = setTimeout(tick, speed);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (isResult) {
    return (
      <div className="flex flex-col flex-1 gap-6">
        <div className="flex justify-center">
          <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
            룰렛 결과
          </div>
        </div>

        <p className="text-center text-sm text-gray-400">두구두구... 벌칙자는?</p>

        <div className="relative bg-blue-500 rounded-2xl p-6 flex flex-col items-center gap-2">
          <span className="absolute top-4 right-4 text-white font-bold text-lg">
            {pool.length}
          </span>
          <div className="w-20 h-20 bg-gray-200 rounded-full" />
          <p className="text-2xl font-black text-white mt-1">{loserNickname}</p>
          <p className="text-white font-semibold">당첨!</p>
          <p className="text-blue-200 text-sm">룰렛 결과로 선정되었어요</p>
        </div>

        <div className="flex flex-col items-center gap-3 mt-2">
          <p className="text-base font-semibold text-gray-800">다음 화면에서 미션을 확인하세요</p>
          <div className="w-24 h-24 bg-gray-200 rounded-xl" />
        </div>

        <button
          onClick={() => navigate('/final')}
          className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold mt-auto cursor-pointer hover:bg-blue-400 transition-colors"
        >
          미션 확인하기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-col items-center gap-5">
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          룰렛 추첨
        </div>
        <p className="text-lg font-bold text-gray-900">룰렛을 돌려 벌칙자를 정해요</p>

        <ul className="w-full flex flex-col gap-2 list-none p-0 mt-2">
          {pool.map((p, idx) => (
            <li
              key={p.id}
              className={[
                'flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-100',
                highlightIndex === idx
                  ? 'bg-blue-500 text-white scale-[1.02]'
                  : 'bg-gray-100 text-gray-700',
              ].join(' ')}
            >
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 ${
                  highlightIndex === idx ? 'bg-white/30' : 'bg-gray-300'
                }`}
              />
              <span className="text-sm font-medium">{p.nickname}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition mt-4"
      >
        {isSpinning ? '돌리는 중...' : '룰렛 돌리기'}
      </button>
    </div>
  );
}
