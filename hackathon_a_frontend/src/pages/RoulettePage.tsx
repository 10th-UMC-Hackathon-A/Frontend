// src/pages/RoulettePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateRouletteRotation, getRandomSpinDuration } from '../utils/roulette';
import { useRoomStore } from '../store/roomStore';
import { useGameStore } from '../store/gameStore';
import creamDefault from '../assets/해커톤 team+/Icon/Cream/Default.png';
import creamCongrats from '../assets/해커톤 team+/Icon/Cream/Congrats.png';

const SECTOR_COLORS = [
  '#DBEAFE', '#93C5FD', '#60A5FA', '#FEE2E2',
  '#FECACA', '#FDE68A', '#BBF7D0', '#DFDBFE',
];

const DUMMY_NAMES = ['도로로', '기로로', '케로로', '타마마', '쿠루루', '한로로', '크롱롱', '도로로2'];
const AUTO_SEC = 5;

export default function RoulettePage() {
  const navigate = useNavigate();
  const { participants: storeParticipants } = useRoomStore();
  const { setLoser } = useGameStore();

  const rawNames =
    storeParticipants.length >= 2
      ? storeParticipants.map((p) => p.nickname)
      : DUMMY_NAMES;
  const count = Math.min(rawNames.length, 8);
  const participants = rawNames.slice(0, count);

  const [rotation, setRotation] = useState(0);
  const [spinDuration, setSpinDuration] = useState(3000);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startCountdown, setStartCountdown] = useState(AUTO_SEC);
  const [resultCountdown, setResultCountdown] = useState(AUTO_SEC);

  const handleSpin = () => {
    if (isSpinning) return;

    // eslint-disable-next-line react-hooks/purity
    const selectedIdx = Math.floor(Math.random() * count);
    const duration = getRandomSpinDuration();
    const targetRotation = rotation + calculateRouletteRotation(selectedIdx, count);

    setSpinDuration(duration);
    setRotation(targetRotation);
    setIsSpinning(true);
    setStartCountdown(0);
    setWinnerIdx(null);
    setShowResult(false);

    setTimeout(() => {
      setWinnerIdx(selectedIdx);
      setTimeout(() => {
        setShowResult(true);
        setIsSpinning(false);
      }, 600);
    }, duration);
  };

  // 5초 후 자동 게임 시작
  useEffect(() => {
    if (showResult || isSpinning) return;
    if (startCountdown <= 0) {
      const t = setTimeout(() => handleSpin(), 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStartCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startCountdown, showResult, isSpinning]);

  // 결과 화면: 5초 후 자동 /final 이동
  useEffect(() => {
    if (!showResult || winnerIdx === null) return;
    if (resultCountdown <= 0) {
      setLoser('', participants[winnerIdx]);
      navigate('/final');
      return;
    }
    const t = setTimeout(() => setResultCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResult, resultCountdown, winnerIdx]);

  // SVG wheel
  const SIZE = 280;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = SIZE / 2 - 2;
  const sectorAngle = 360 / count;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const getSectorPath = (index: number): string => {
    const startRad = toRad(-90 + index * sectorAngle - sectorAngle / 2);
    const endRad = toRad(-90 + index * sectorAngle + sectorAngle / 2);
    const x1 = CX + R * Math.cos(startRad);
    const y1 = CY + R * Math.sin(startRad);
    const x2 = CX + R * Math.cos(endRad);
    const y2 = CY + R * Math.sin(endRad);
    const largeArc = sectorAngle > 180 ? 1 : 0;
    return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const getTextTransform = (index: number): string => {
    const angle = -90 + index * sectorAngle;
    const textR = R * 0.63;
    const tx = CX + textR * Math.cos(toRad(angle));
    const ty = CY + textR * Math.sin(toRad(angle));
    const base = angle + 90;
    const textRotation = angle > 0 && angle < 180 ? base + 180 : base;
    return `translate(${tx}, ${ty}) rotate(${textRotation})`;
  };

  const fontSize = count <= 4 ? 14 : count <= 6 ? 12 : 11;

  if (showResult && winnerIdx !== null) {
    return (
      <div className="flex flex-col flex-1 gap-6">
        <div className="flex justify-center">
          <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
            투표 결과
          </div>
        </div>
        <p className="text-center text-sm text-gray-400">두구두구... 벌칙자는?</p>
        <div className="relative bg-blue-500 rounded-2xl p-6 flex flex-col items-center gap-2">
          <span className="absolute top-4 right-4 text-white font-bold text-lg">{count}</span>
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <img src={creamDefault} alt="크림 캐릭터" className="w-20 h-20 object-contain" />
          </div>
          <p className="text-3xl font-black text-white mt-1">{participants[winnerIdx]}</p>
          <p className="text-white font-semibold">당첨!</p>
          <p className="text-blue-200 text-sm">룰렛 결과로 선정되었어요</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-base font-semibold text-gray-800">다음 화면에서 미션을 확인하세요</p>
          <img src={creamCongrats} alt="축하 캐릭터" className="w-32 h-32 object-contain" />
        </div>
        <button
          onClick={() => { setLoser('', participants[winnerIdx]); navigate('/final'); }}
          className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold mt-auto"
        >
          미션 확인하기 ({resultCountdown}초)
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 justify-between overflow-hidden">
      <div className="flex flex-col items-center gap-4 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          룰렛 추첨
        </div>
        <p className="text-lg font-bold text-gray-900">룰렛을 돌려 벌칙자를 정해요</p>

        {/* 룰렛 휠 */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="w-0 h-0
              border-l-[9px] border-l-transparent
              border-r-[9px] border-r-transparent
              border-t-[18px] border-t-blue-500"
            />
          </div>

          <svg
            width={SIZE}
            height={SIZE}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? `transform ${spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
                : 'none',
            }}
          >
            {participants.map((name, i) => (
              <g key={i}>
                <path
                  d={getSectorPath(i)}
                  fill={SECTOR_COLORS[i % SECTOR_COLORS.length]}
                  stroke="#E2E8F0"
                  strokeWidth={3}
                />
                <text
                  transform={getTextTransform(i)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={fontSize}
                  fontWeight="600"
                  fill="#374151"
                >
                  {name}
                </text>
              </g>
            ))}
            <circle
              cx={CX}
              cy={CY}
              r={24}
              fill="white"
              filter="drop-shadow(0 2px 6px rgba(0,0,0,0.15))"
            />
          </svg>
        </div>

        {/* 후보자 목록 */}
        <div className="w-full">
          <p className="text-sm font-semibold text-gray-700 mb-2">후보자({count}명)</p>
          <div className="grid grid-cols-2 gap-2">
            {participants.map((name, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border
                  ${!isSpinning && winnerIdx === i
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200'}`}
              >
                <span className={`text-sm font-medium truncate
                  ${!isSpinning && winnerIdx === i ? 'text-blue-600' : 'text-gray-700'}`}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition mt-4"
      >
        {isSpinning ? '돌리는 중...' : `룰렛 돌리기 (${startCountdown}초)`}
      </button>
    </div>
  );
}
