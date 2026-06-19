import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_WINNER = '더워요2';
const PARTICIPANT_COUNT = 5;
const participants = ['참가자 1', '참가자 2', '참가자 3', '참가자 4'];

export default function RoulettePage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [isResult, setIsResult] = useState(false);
  const navigate = useNavigate();

  const handleSpin = () => {
    setIsSpinning(true);
    const picked = Math.floor(Math.random() * participants.length);
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedIndex(picked);
      setTimeout(() => setIsResult(true), 800);
    }, 3000);
  };

  if (isResult) {
    return (
      <div className="flex flex-col flex-1 gap-6">
        <div className="flex justify-center">
          <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
            투표 결과
          </div>
        </div>

        <p className="text-center text-sm text-gray-400">두구두구... 벌칙자는?</p>

        <div className="relative bg-blue-500 rounded-2xl p-6 flex flex-col items-center gap-2">
          <span className="absolute top-4 right-4 text-white font-bold text-lg">
            {PARTICIPANT_COUNT}
          </span>
          <div className="w-20 h-20 bg-gray-200 rounded-full" />
          <p className="text-2xl font-black text-white mt-1">{MOCK_WINNER}</p>
          <p className="text-white font-semibold">당첨!</p>
          <p className="text-blue-200 text-sm">룰렛 결과로 선정되었어요</p>
        </div>

        <div className="flex flex-col items-center gap-3 mt-2">
          <p className="text-base font-semibold text-gray-800">다음 화면에서 미션을 확인하세요</p>
          <div className="w-24 h-24 bg-gray-200 rounded-xl" />
        </div>

        <button
          onClick={() => navigate('/final')}
          className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold mt-auto"
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

        {/* TODO: 룰렛 컴포넌트 CSS 작업 후 RouletteWheel로 교체 */}
        <div className="w-full flex-1 flex items-center justify-center py-4">
          <div className="w-64 h-64 bg-gray-100 rounded-full" />
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition"
      >
        {isSpinning ? '돌리는 중...' : '룰렛 돌리기'}
      </button>
    </div>
  );
}
