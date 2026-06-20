import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { useGameStore } from '../store/gameStore';
import lotsBox from '../assets/Lots Box.png';
import creamDefault from '../assets/Cream/Default.png';
import creamCongrats from '../assets/Cream/Congrats.png';

const DUMMY_PARTICIPANTS = [
  { id: 'd1', nickname: '김철수' },
  { id: 'd2', nickname: '이영희' },
  { id: 'd3', nickname: '박민준' },
  { id: 'd4', nickname: '최서연' },
  { id: 'd5', nickname: '정도현' },
];

const DUMMY_MISSIONS = ['에어컨 1도 조절하기', '팔굽혀펴기 10개', '노래 한 소절 부르기'];

export default function BombPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isResult, setIsResult] = useState(false);
  const navigate = useNavigate();

  const { participants } = useRoomStore();
  const { setLoser, setPunishment, loserNickname } = useGameStore();

  const pool =
    participants.length > 0
      ? participants.map((p) => ({ id: p.id, nickname: p.nickname }))
      : DUMMY_PARTICIPANTS;

  const handleDraw = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const loser = pool[Math.floor(Math.random() * pool.length)];
      const mission = DUMMY_MISSIONS[Math.floor(Math.random() * DUMMY_MISSIONS.length)];
      setLoser(loser.id, loser.nickname);
      setPunishment(mission);
      setIsSpinning(false);
      setTimeout(() => setIsResult(true), 400);
    }, 1500);
  };

  if (isResult) {
    return (
      <div className="flex flex-col flex-1 gap-6">
        <div className="flex justify-center">
          <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
            제비뽑기 결과
          </div>
        </div>

        <p className="text-center text-sm text-gray-400">두구두구... 벌칙자는?</p>

        <div className="relative bg-blue-500 rounded-2xl p-6 flex flex-col items-center gap-2">
          <span className="absolute top-4 right-4 text-white font-bold text-lg">
            {pool.length}
          </span>
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <img src={creamDefault} alt="크림 캐릭터" className="w-64 h-64 object-contain" />
          </div>
          <p className="text-3xl font-black text-white mt-1">{loserNickname}</p>
          <p className="text-white font-semibold">당첨!</p>
          <p className="text-blue-200 text-sm">제비뽑기 결과로 선정되었어요</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-base font-semibold text-gray-800">다음 화면에서 미션을 확인하세요</p>
          <img src={creamCongrats} alt="축하 캐릭터" className="w-52 h-52 object-contain" />
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
          제비 뽑기
        </div>
        <p className="text-lg font-bold text-gray-900">제비를 뽑아 벌칙자를 정해요</p>
      </div>

      <div className="flex justify-center items-center flex-1">
        <img
          src={lotsBox}
          alt="제비뽑기 통"
          className={`w-64 h-64 object-contain transition-transform ${isSpinning ? 'animate-bounce' : ''}`}
        />
      </div>

      <button
        onClick={handleDraw}
        disabled={isSpinning}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition mt-4"
      >
        {isSpinning ? '뽑는 중...' : '제비 뽑기'}
      </button>
    </div>
  );
}
