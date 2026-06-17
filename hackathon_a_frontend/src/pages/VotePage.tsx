import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const question = 'Q. 지금 사무실 온도는 어때요?';

const options = [
  { id: 'agree', label: '추워요!', description: '히터 좀 틀어주세요' },
  { id: 'disagree', label: '더워요!', description: '에어컨 좀 켜주세요' },
];

export default function VotePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleVote = () => {
    if (!selected) return;
    navigate('/result');
  };

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-900">찬반투표</h2>
          <p className="text-base text-gray-700 mt-2">{question}</p>
          <p className="text-sm text-gray-400 mt-1">맞는 줄 하나를 선택해 투표해 주세요</p>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          {options.map((option) => {
            const isSelected = selected === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setSelected(option.id)}
                className={[
                  'w-full py-7 px-5 rounded-2xl text-left transition-all',
                  isSelected
                    ? 'bg-gray-800 text-white'
                    : 'bg-white border border-gray-200 text-gray-800',
                ].join(' ')}
              >
                <p className="text-lg font-bold">{option.label}</p>
                <p className={`text-sm mt-1 ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 text-center mt-1">
          이미 투표하셨다면 선택할 수 없어요
        </p>
      </div>

      <button
        onClick={handleVote}
        disabled={!selected}
        className="w-full bg-gray-800 text-white py-4 rounded-xl text-sm font-medium disabled:bg-gray-200 disabled:text-gray-400"
      >
        투표하기
      </button>
    </div>
  );
}
