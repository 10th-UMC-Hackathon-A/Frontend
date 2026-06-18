import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const question = 'Q. 지금 강의실 온도 어때요?';
const participantCount = 0;

const options = [
  { id: 'agree', label: '추워요!' },
  { id: 'disagree', label: '더워요!' },
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
      <div className="flex flex-col items-center gap-5">
        {/* 상단 뱃지 */}
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          찬반 투표
        </div>

        {/* 질문 */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-lg font-bold text-gray-900">{question}</p>
          <p className="text-sm text-gray-400">지금까지 {participantCount}명 참가 중...</p>
        </div>

        {/* 캐릭터 이미지 */}
        <div className="w-28 h-28 bg-gray-200 rounded-xl" />

        {/* 투표 선택지 */}
        <div className="flex flex-col gap-3 w-full">
          {options.map((option) => {
            const isSelected = selected === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setSelected(option.id)}
                className={[
                  'w-full py-8 rounded-2xl text-lg font-bold transition-all',
                  isSelected
                    ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-400'
                    : 'bg-gray-100 text-gray-800',
                ].join(' ')}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-gray-400">ⓘ 한 번 투표하면 변경할 수 없어요</p>
      </div>

      {/* 투표하기 버튼 */}
      <button
        onClick={handleVote}
        disabled={!selected}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition"
      >
        투표하기
      </button>
    </div>
  );
}
