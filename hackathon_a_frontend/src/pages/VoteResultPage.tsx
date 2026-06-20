import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoteStore } from '../store/voteStore';
import { useGameStore } from '../store/gameStore';
import creamDefault from '../assets/Cream/Default.png';
import creamCold from '../assets/Cream/Cold.png';
import creamHot from '../assets/Cream/Hot.png';

type MiniGameMode = 'bomb' | 'roulette' | 'ladder';

const COUNTDOWN_SEC = 5;
const question = 'Q. 지금 강의실 온도 어때요?';

function selectGameByCount(voterCount: number): MiniGameMode {
  if (voterCount <= 5) {
    const games: MiniGameMode[] = ['bomb', 'roulette', 'ladder'];
    return games[Math.floor(Math.random() * 3)];
  }
  if (voterCount <= 8) {
    const games: MiniGameMode[] = ['bomb', 'roulette'];
    return games[Math.floor(Math.random() * 2)];
  }
  return 'bomb';
}

export default function VoteResultPage() {
  const navigate = useNavigate();
  const { voteResults } = useVoteStore();
  const { setMiniGameMode, setWinnerVoteLabel } = useGameStore();

  const total = voteResults.reduce((sum, r) => sum + r.count, 0);
  const maxCount = total > 0 ? Math.max(...voteResults.map((r) => r.count)) : 0;
  const isTie = total > 0 && voteResults.filter((r) => r.count === maxCount).length > 1;
  const winner =
    !isTie && voteResults.length > 0
      ? voteResults.reduce((a, b) => (a.count > b.count ? a : b))
      : null;

  const displayResults =
    voteResults.length > 0
      ? voteResults
      : [
          { label: '추워요!', count: 0 },
          { label: '더워요!', count: 0 },
        ];

  const selectedModeRef = useRef<MiniGameMode | null>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_SEC);

  // 페이지 진입 시 게임 모드 미리 결정
  useEffect(() => {
    selectedModeRef.current = selectGameByCount(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isTie) {
      navigate('/draw');
      return;
    }

    if (countdown <= 0) {
      const mode = selectedModeRef.current ?? 'bomb';
      setMiniGameMode(mode);
      if (winner) setWinnerVoteLabel(winner.label);
      navigate(`/${mode}`);
      return;
    }

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, isTie]);

  const handleNavigate = () => {
    const mode = selectedModeRef.current ?? 'bomb';
    setMiniGameMode(mode);
    if (winner) setWinnerVoteLabel(winner.label);
    navigate(`/${mode}`);
  };

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
        <img
          src={winner?.label === '추워요!' ? creamCold : winner?.label === '더워요!' ? creamHot : creamDefault}
          alt="크림 캐릭터"
          className="w-64 h-64 object-contain"
        />
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
      ) : total === 0 ? (
        <section className="flex flex-col items-center gap-1">
          <p className="text-base font-semibold text-gray-400 text-center">투표 결과가 없습니다</p>
        </section>
      ) : null}

      <section className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-blue-500">{question}</p>
        <p className="text-xs text-gray-400 mb-3">
          총 {total}명 참여 ·{' '}
          {displayResults.map((r) => `${r.label} ${r.count}`).join(' / ')}
        </p>

        {displayResults.map((result) => {
          const percentage = total > 0 ? Math.round((result.count / total) * 100) : 0;
          return (
            <div key={result.label} className="flex flex-col gap-1.5 mb-2">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>{result.label}</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${result.label === '추워요!' ? 'bg-blue-500' : 'bg-red-400'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>

      <button
        onClick={handleNavigate}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold mt-auto cursor-pointer hover:bg-blue-400 transition-colors"
      >
        {countdown > 0 ? `벌칙자를 찾기로 가기 (${countdown}초)` : '이동 중...'}
      </button>
    </main>
  );
}
