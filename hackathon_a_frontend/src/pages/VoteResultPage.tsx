import { useNavigate } from 'react-router-dom';
import { useVoteStore } from '../store/voteStore';
import { useGameStore } from '../store/gameStore';

const question = 'Q. 지금 강의실 온도 어때요?';
const MINI_GAMES = ['bomb', 'roulette', 'ladder'] as const;

export default function VoteResultPage() {
  const navigate = useNavigate();
  const { voteResults } = useVoteStore();
  const { setMiniGameMode, setWinnerVoteLabel } = useGameStore();

  const total = voteResults.reduce((sum, r) => sum + r.count, 0);

  const winner =
    voteResults.length > 0
      ? voteResults.reduce((a, b) => (a.count > b.count ? a : b))
      : null;

  const displayResults =
    voteResults.length > 0
      ? voteResults
      : [
          { label: '추워요!', count: 0 },
          { label: '더워요!', count: 0 },
        ];

  return (
    <main className="flex flex-col flex-1 gap-5">
      <div className="flex justify-center">
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          투표 결과
        </div>
      </div>

      <section className="flex flex-col items-center gap-0.5">
        <p className="text-xl font-bold text-gray-900">투표가 마감되었습니다</p>
      </section>

      <div className="flex justify-center">
        <div className="w-28 h-28 bg-gray-200 rounded-xl" aria-hidden="true" />
      </div>

      {winner ? (
        <section className="flex flex-col items-center gap-1">
          <p className="text-2xl font-black text-gray-900 text-center">
            {winner.label}가 이겼어요
          </p>
          <p className="text-xs text-gray-400 text-center">
            이 중({winner.label})에서 벌칙자를 골라올게요
          </p>
        </section>
      ) : (
        <section className="flex flex-col items-center gap-1">
          <p className="text-base font-semibold text-gray-400 text-center">투표 결과가 없습니다</p>
        </section>
      )}

      <section className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-blue-500">{question}</p>
        <p className="text-xs text-gray-400 mb-3">
          총 {total}명 참여 ·{' '}
          {displayResults.map((r) => `${r.label} ${r.count}`).join(' / ')}
        </p>

        {displayResults.map((result, idx) => {
          const percentage = total > 0 ? Math.round((result.count / total) * 100) : 0;
          return (
            <div key={result.label} className="flex flex-col gap-1.5 mb-2">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>{result.label}</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${idx === 0 ? 'bg-blue-500' : 'bg-red-400'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>

      <button
        onClick={() => {
          const mode = MINI_GAMES[Math.floor(Math.random() * MINI_GAMES.length)];
          setMiniGameMode(mode);
          if (winner) setWinnerVoteLabel(winner.label);
          navigate(`/${mode}`);
        }}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold mt-auto cursor-pointer hover:bg-blue-400 transition-colors"
      >
        벌칙자를 찾기로 가기
      </button>
    </main>
  );
}
