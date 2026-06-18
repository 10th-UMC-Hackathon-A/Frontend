import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVote } from '../hooks/useVote';
import { useRoomStore } from '../store/roomStore';

const question = 'Q. 지금 강의실 온도는 어때요?';

const options = [
  { id: 'cold', label: '추워요!', position: '추워요', description: '에어컨 좀 줄여주세요 ㅜㅜ' },
  { id: 'hot', label: '더워요!', position: '더워요', description: '에어컨 좀 켜주세요!!!' },
];

export default function VotePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();
  const { roomId } = useRoomStore();
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
      <section className="flex flex-col gap-5">
        <header className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-gray-900">찬반투표</h1>
          <p className="text-base text-gray-700 mt-2">{question}</p>
          <p className="text-sm text-gray-400 mt-1">맞는 항목을 선택해 투표해 주세요</p>
        </header>

        <ul className="flex flex-col gap-3 mt-2 list-none p-0">
          {options.map((option) => {
            const isSelected = selected === option.id;
            return (
              <li key={option.id}>
                <button
                  onClick={() => setSelected(option.id)}
                  className={[
                    'w-full py-7 px-5 rounded-2xl text-left transition-all cursor-pointer',
                    isSelected
                      ? 'bg-gray-800 text-white'
                      : 'bg-white border border-gray-200 text-gray-800 hover:border-gray-400 hover:bg-gray-50',
                  ].join(' ')}
                >
                  <p className="text-lg font-bold">{option.label}</p>
                  <p className={`text-sm mt-1 ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                    {option.description}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>

        {error && (
          <p role="alert" className="text-xs text-red-400 text-center">
            {error}
          </p>
        )}
      </section>

      <button
        onClick={handleVote}
        disabled={!selected || isLoading}
        className="w-full bg-gray-800 text-white py-4 rounded-xl text-sm font-medium
          disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
          hover:bg-gray-700 active:bg-gray-900 cursor-pointer transition-colors"
      >
        {isLoading ? '투표 중...' : '투표하기'}
      </button>
    </main>
  );
}
