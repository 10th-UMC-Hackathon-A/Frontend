import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVote } from '../hooks/useVote';
import { useRoomStore } from '../store/roomStore';

const question = 'Q. 지금 강의실 온도는 어때요?';
const participantCount = 0;

const options = [
  { id: 'cold', label: '추워요!', position: '추워요', description: '에어컨 좀 줄여주세요 ㅜㅜ' },
  { id: 'hot', label: '더워요!', position: '더워요', description: '에어컨 좀 켜주세요!!!' },
];

export default function VotePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();
  const { roomId } = useRoomStore();
  // 테스트용 더미: roomId가 없을 때도 동작하도록 0으로 폴백
  const { submitVote, isLoading, error } = useVote(roomId ?? 0);

  const handleVote = async () => {
    const option = options.find((o) => o.id === selected);
    if (!option || !roomId) return;
    try {
      await submitVote(option.position);
      navigate('/result');
    } catch {
      // error는 useVote 내부에서 관리
    }
  };

  return (
<main className="flex flex-col flex-1 justify-between">
  <section className="flex flex-col items-center gap-5">
    {/* 상단 뱃지 */}
    <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
      찬반 투표
    </div>

    {/* 질문 */}
    <header className="flex flex-col items-center gap-1">
      <p className="text-lg font-bold text-gray-900 text-center">{question}</p>
      <p className="text-sm text-gray-400">지금까지 {participantCount}명 참가 중...</p>
    </header>

    {/* 캐릭터 이미지 */}
    <div className="w-28 h-28 bg-gray-200 rounded-xl" aria-hidden="true" />

    {/* 투표 선택지 */}
    <ul className="flex flex-col gap-3 w-full list-none p-0">
      {options.map((option) => {
        const isSelected = selected === option.id;

        return (
          <li key={option.id}>
            <button
              onClick={() => setSelected(option.id)}
              className={[
                'w-full py-8 px-5 rounded-2xl text-center transition-all cursor-pointer',
                isSelected
                  ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-400'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
              ].join(' ')}
            >
              <p className="text-lg font-bold">{option.label}</p>
              <p className={`text-sm mt-1 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`}>
                {option.description}
              </p>
            </button>
          </li>
        );
      })}
    </ul>

    {error && (
      <p role="alert" className="text-xs text-gray-400">
        {error}
      </p>
    )}
  </section>

      {/* 투표하기 버튼 */}
      <button
        onClick={handleVote}
        disabled={!selected || isLoading}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition"
      >
        {isLoading ? '투표 중...' : '투표하기'}
      </button>
    </main>
  );
}
