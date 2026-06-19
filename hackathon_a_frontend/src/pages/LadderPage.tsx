import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { useGameStore } from '../store/gameStore';

const DUMMY_PARTICIPANTS = [
  { id: 'd1', nickname: '김철수' },
  { id: 'd2', nickname: '이영희' },
  { id: 'd3', nickname: '박민준' },
  { id: 'd4', nickname: '최서연' },
];

const DUMMY_MISSIONS = ['에어컨 1도 조절하기', '팔굽혀펴기 10개', '노래 한 소절 부르기'];

export default function LadderPage() {
  const [showResult, setShowResult] = useState(false);
  const [isWinnerCard, setIsWinnerCard] = useState(false);
  const navigate = useNavigate();

  const { participants } = useRoomStore();
  const { setLoser, setPunishment, loserNickname } = useGameStore();

  const pool =
    participants.length > 0
      ? participants.map((p) => ({ id: p.id, nickname: p.nickname }))
      : DUMMY_PARTICIPANTS;

  const handleStart = () => {
    setShowResult(true);
    // eslint-disable-next-line react-hooks/purity
    const loser = pool[Math.floor(Math.random() * pool.length)];
    // eslint-disable-next-line react-hooks/purity
    const mission = DUMMY_MISSIONS[Math.floor(Math.random() * DUMMY_MISSIONS.length)];
    setLoser(loser.id, loser.nickname);
    setPunishment(mission);
    setTimeout(() => setIsWinnerCard(true), 1500);
  };

  if (isWinnerCard) {
    return (
      <div className="flex flex-col flex-1 gap-6">
        <div className="flex justify-center">
          <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
            사다리 결과
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
          <p className="text-blue-200 text-sm">사다리 결과로 선정되었어요</p>
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
    <div className="flex flex-col flex-1 justify-between overflow-hidden">
      <div className="flex flex-col items-center gap-4 flex-1 overflow-hidden">
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          사다리 타기
        </div>
        <p className="text-lg font-bold text-gray-900">사다리를 타고 벌칙자를 정해요</p>

        <div className="w-full bg-gray-100 rounded-2xl p-4 flex flex-col flex-1">
          {/* 상단: 아바타 + 이름 */}
          <div className="flex justify-around">
            {pool.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <span className="text-xs text-gray-500 max-w-[48px] truncate text-center">
                  {p.nickname}
                </span>
              </div>
            ))}
          </div>

          {/* 사다리 시각화 */}
          <div className="flex-1 flex items-center justify-center my-3">
            {showResult ? (
              <p className="text-sm text-blue-500 font-semibold animate-pulse">사다리 타는 중...</p>
            ) : (
              <div className="flex gap-4 h-full items-stretch py-2">
                {pool.map((p) => (
                  <div key={p.id} className="w-0.5 bg-gray-300 rounded-full" />
                ))}
              </div>
            )}
          </div>

          {/* 하단: 이름 + 아바타 */}
          <div className="flex justify-around">
            {pool.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 max-w-[48px] truncate text-center">
                  {p.nickname}
                </span>
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
