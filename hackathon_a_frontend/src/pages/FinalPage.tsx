import { useEffect, useState } from 'react';

const MISSION_DURATION = 300; // 5분
const MOCK_NICKNAME = '더워요2';
const MOCK_MISSION = '춤추면서 에어컨 1도 낮추기';
const MOCK_MISSION_DETAIL = '온도 조절 + 간단한 액션을 함께';

// TODO: 실제 연동 시 본인 여부를 store에서 가져오기
const IS_SELF = false;

export default function FinalPage() {
  const [timeLeft, setTimeLeft] = useState(MISSION_DURATION);
  const isEnded = timeLeft === 0;

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

  return (
    <div className="flex flex-col flex-1 justify-between gap-3">
      {/* 상단 뱃지 */}
      <div className="flex justify-center">
        <div className={[
          'text-sm font-semibold px-5 py-2 rounded-full',
          IS_SELF ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500',
        ].join(' ')}>
          {IS_SELF ? '본인이 벌칙자!' : '미션 관전 중'}
        </div>
      </div>

      {/* 벌칙자 카드 */}
      <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-5 -mt-20">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
        <div>
          <p className="text-base font-bold text-gray-900">
            {IS_SELF ? MOCK_NICKNAME : `${MOCK_NICKNAME} 님이 미션 수행 중`}
          </p>
          <p className="text-xs text-gray-400">이번 라운드 벌칙자</p>
        </div>
      </div>

      {/* 미션 카드 */}
      <div className="bg-blue-500 rounded-2xl px-5 py-6 flex flex-col items-center gap-2 text-center -mt-20">
        <p className="text-blue-200 text-sm">
          {IS_SELF ? '오늘의 미션' : '벌칙자가 수행 중인 미션'}
        </p>
        <p className="text-white text-2xl font-black leading-tight">{MOCK_MISSION}</p>
        <p className="text-blue-200 text-sm mt-1">{MOCK_MISSION_DETAIL}</p>
      </div>

      {/* 타이머 */}
      <div className="flex justify-center -mt-15">
        <div className="w-65 h-65 rounded-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-center">
          <p className="text-5xl font-black text-blue-500">{formatTime(timeLeft)}</p>
        </div>
      </div>

      {/* 하단 버튼 */}
      {IS_SELF ? (
        <button
          disabled={!isEnded}
          className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition"
        >
          미션 완료
        </button>
      ) : (
        <button
          disabled
          className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl text-base font-semibold cursor-not-allowed"
        >
          다음 라운드 대기 중...
        </button>
      )}
    </div>
  );
}
