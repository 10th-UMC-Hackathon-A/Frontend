import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { useGameStore } from '../store/gameStore';
import { penaltyApi } from '../api/penaltyApi';
import lotsBox from '../assets/images/Lots Box Cropped.png';
import creamYou from '../assets/images/Icon/Cream/You.png';
import creamCongrats from '../assets/images/Icon/Cream/Congrats.png';

const DUMMY_MISSIONS = ['에어컨 1도 조절하기', '팔굽혀펴기 10개', '노래 한 소절 부르기'];

const AUTO_SEC = 5;

export default function BombPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isResult, setIsResult] = useState(false);
  const [startCountdown, setStartCountdown] = useState(AUTO_SEC);
  const [resultCountdown, setResultCountdown] = useState(AUTO_SEC);
  const navigate = useNavigate();

  const { roomId: storeRoomId } = useRoomStore();
  const { setLoser, setPunishment, loserNickname } = useGameStore();
  const roomId = storeRoomId ?? (Number(localStorage.getItem('roomId')) || 0);

  const handleDraw = async () => {
    if (isSpinning || isResult) return;
    setIsSpinning(true);
    setStartCountdown(0);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // 정상 흐름에서는 결과 페이지에서 정해진 벌칙자를 그대로 사용한다.
      // BombPage로 직접 진입한 경우에만 백엔드에서 한 번 추첨한다.
      if (!loserNickname) {
        if (!roomId) throw new Error('방 정보가 없습니다.');
        const response = await penaltyApi.drawPenaltyUser(roomId);
        setLoser('', response.result.nickName);
      }

      const mission = DUMMY_MISSIONS[Math.floor(Math.random() * DUMMY_MISSIONS.length)];
      setPunishment(mission);
      setIsSpinning(false);
      setTimeout(() => setIsResult(true), 400);
    } catch {
      setIsSpinning(false);
      setStartCountdown(AUTO_SEC);
    }
  };

  // 5초 후 자동 게임 시작
  useEffect(() => {
    if (isResult || isSpinning) return;
    if (startCountdown <= 0) {
      const t = setTimeout(() => handleDraw(), 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStartCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startCountdown, isResult, isSpinning]);

  // 결과 화면: 5초 후 자동 /final 이동
  useEffect(() => {
    if (!isResult) return;
    if (resultCountdown <= 0) {
      navigate('/final');
      return;
    }
    const t = setTimeout(() => setResultCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResult, resultCountdown]);

  if (isResult) {
    return (
      <div className="flex flex-col flex-1 min-h-0 gap-[clamp(8px,2vh,24px)]">
        <div className="flex justify-center">
          <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
            제비뽑기 결과
          </div>
        </div>

        <p className="text-center text-lg font-semibold text-gray-500">두구두구... 벌칙자는?</p>

        <div className="relative mx-4 bg-blue-600 rounded-2xl px-6 py-[clamp(16px,3vh,32px)] flex flex-col items-center gap-2">
          <span className="absolute top-4 right-5 text-4xl font-black text-blue-200">
            {resultCountdown}
          </span>
          <div className="w-[clamp(112px,16vh,144px)] aspect-square bg-white rounded-full border-[5px] border-blue-100 flex items-center justify-center overflow-hidden">
            <img
              src={creamYou}
              alt="당첨된 크림 캐릭터"
              className="w-full h-full object-contain scale-110 translate-y-2"
            />
          </div>
          <p className="text-3xl font-black text-white mt-1">{loserNickname}</p>
          <p className="text-white font-semibold">당첨!</p>
          <p className="text-blue-200 text-sm">제비뽑기 결과로 선정되었어요</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-base font-semibold text-gray-800">다음 화면에서 미션을 확인하세요</p>
          <img
            src={creamCongrats}
            alt="축하 캐릭터"
            className="w-[clamp(120px,20vh,208px)] h-auto aspect-square object-contain"
          />
        </div>

        <button
          onClick={() => navigate('/final')}
          className="w-full bg-blue-500 text-white py-3 rounded-2xl text-base font-semibold mt-auto cursor-pointer hover:bg-blue-400 transition-colors"
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
          className={`w-auto max-h-[360px] object-contain transition-transform ${isSpinning ? 'animate-bounce' : ''}`}
        />
      </div>

      <button
        onClick={handleDraw}
        disabled={isSpinning}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition mt-4"
      >
        {isSpinning ? '뽑는 중...' : `제비 뽑기 (${startCountdown}초)`}
      </button>
    </div>
  );
}
