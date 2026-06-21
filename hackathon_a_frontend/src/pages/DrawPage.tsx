import { useEffect, useState } from 'react';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useVoteStore } from '../store/voteStore';
import creamDefault from '../assets/images/Icon/Cream/Default.png';

const COUNTDOWN_SEC = 5;
const question = 'Q. 지금 강의실 온도 어때요?';

export default function DrawPage() {
  const navigate = useNavigate();
  const { voteResults, reset: resetVote } = useVoteStore();
  const [countdown, setCountdown] = useState(COUNTDOWN_SEC);

  const total = voteResults.reduce((sum, result) => sum + result.count, 0);
  const maxCount = voteResults.length > 0 ? Math.max(...voteResults.map((result) => result.count)) : 0;
  const displayResults =
    voteResults.length > 0
      ? voteResults
      : [
          { label: '추워요', count: 0 },
          { label: '더워요', count: 0 },
        ];

  const handleReVote = () => {
    localStorage.removeItem('myVote');
    resetVote();
    navigate('/vote', { replace: true });
  };

  useEffect(() => {
    if (countdown <= 0) {
      localStorage.removeItem('myVote');
      resetVote();
      navigate('/vote', { replace: true });
      return;
    }

    const timer = setTimeout(() => setCountdown((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate, resetVote]);

  return (
    <main className="flex flex-col flex-1 min-h-0 gap-[clamp(8px,1.7vh,16px)]">
      <div className="flex justify-center">
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          투표 결과
        </div>
      </div>

      <section className="flex flex-col items-center gap-1 mt-[clamp(4px,1.5vh,16px)]">
        <p className="text-xl font-bold text-gray-900">투표 마감</p>
        <p className="text-base font-semibold text-gray-400">재투표까지</p>
        <p className="text-[clamp(64px,11vh,96px)] leading-none font-black text-gray-900 mt-1">
          {countdown}
        </p>
      </section>

      <div className="bg-blue-50/50 rounded-2xl py-[clamp(12px,2.5vh,24px)] flex justify-center">
        <img
          src={creamDefault}
          alt="크림 캐릭터"
          className="w-[clamp(120px,20vh,176px)] h-auto aspect-square object-contain"
        />
      </div>

      <p className="text-3xl font-black text-gray-900 text-center">비겼어요</p>

      <section className="flex flex-col gap-3 px-2 mt-3">
        <p className="text-lg font-bold text-gray-500 text-center">{question}</p>
        <p className="text-sm text-gray-400 text-center -mt-2">
          총 {total}명 참여 · {displayResults.map((result) => `${result.label} ${result.count}`).join(' / ')}
        </p>

        {displayResults.map((result) => {
          const percentage = maxCount > 0 ? Math.round((result.count / maxCount) * 100) : 0;
          return (
            <div key={result.label} className="flex flex-col gap-1">
              <div className="flex justify-between text-base font-semibold text-gray-700">
                <span>{result.label}</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${result.label === '추워요' ? 'bg-blue-500' : 'bg-red-400'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>

      <Button variant="blue" fullWidth onClick={handleReVote} className="mt-auto">
        다시 투표하기
      </Button>
    </main>
  );
}
