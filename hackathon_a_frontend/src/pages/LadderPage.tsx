import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_WINNER = '더워요2';
const PARTICIPANT_COUNT = 5;
const participants = ['참가자 1', '참가자 2', '참가자 3', '참가자 4'];

export default function LadderPage() {
  const [showResult, setShowResult] = useState(false);
  const [isWinnerCard, setIsWinnerCard] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    setShowResult(true);
    setTimeout(() => setIsWinnerCard(true), 1500);
  };

  if (isWinnerCard) {
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
          <p className="text-blue-200 text-sm">사다리 결과로 선정되었어요</p>
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
    <div className="flex flex-col flex-1 justify-between overflow-hidden">
      <div className="flex flex-col items-center gap-4 flex-1 overflow-hidden">
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          사다리 타기
        </div>
        <p className="text-lg font-bold text-gray-900">사다리를 타고 벌칙자를 정해요</p>

        {/* 참가자 아바타 + 사다리 */}
        <div className="w-full bg-gray-100 rounded-2xl p-4 flex flex-col flex-1">
          {/* 상단: 아바타 + 이름 */}
          <div className="flex justify-around">
            {participants.map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <span className="text-xs text-gray-500">{p}</span>
              </div>
            ))}
          </div>

          {/* 사다리 영역 (TODO: LadderCanvas CSS 구현 후 교체) */}
          <div className="flex-1" />

          {/* 하단: 이름 + 아바타 */}
          <div className="flex justify-around">
            {participants.map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">{p}</span>
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={showResult}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition mt-4"
      >
        사다리 타기
      </button>
    </div>
  );
}
