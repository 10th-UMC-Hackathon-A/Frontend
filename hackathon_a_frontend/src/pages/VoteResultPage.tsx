import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoteStore } from '../store/voteStore';
import { useGameStore } from '../store/gameStore';
import { useRoomStore } from '../store/roomStore';
import { penaltyApi } from '../api/penaltyApi';
import { voteApi } from '../api/voteApi';
import creamDefault from '../assets/images/Icon/Cream/Default.png';
import creamCold from '../assets/images/Icon/Cream/Cold.png';
import creamHot from '../assets/images/Icon/Cream/Hot.png';

type MiniGameMode = 'bomb' | 'roulette' | 'ladder';

const COUNTDOWN_SEC = 10;
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

// 백엔드 penaltyType(enum) → 프론트 미니게임 모드
function mapPenaltyType(penaltyType: string): MiniGameMode | null {
  switch (penaltyType) {
    case 'ROULETTE':
      return 'roulette';
    case 'LOTTERY':
      return 'bomb';
    case 'LADDER_GAME':
      return 'ladder';
    default:
      return null;
  }
}

export default function VoteResultPage() {
  const navigate = useNavigate();
  const { voteResults, setVoteResults } = useVoteStore();
  const { setMiniGameMode, setWinnerVoteLabel, setLoser, setLoserIndex } = useGameStore();
  const { roomId: storeRoomId, setParticipants } = useRoomStore();
  const roomId = storeRoomId ?? (Number(localStorage.getItem('roomId')) || 0);

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
          { label: '추워요', count: 0 },
          { label: '더워요', count: 0 },
        ];

  const selectedModeRef = useRef<MiniGameMode | null>(null);
  const penaltyRequestedRef = useRef(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SEC);

  // 마운트 시 현재 투표 현황을 백엔드에서 직접 조회 (store stale 방지)
  useEffect(() => {
    if (!roomId) return;
    voteApi
      .getVoteStatus(roomId)
      .then((res) => setVoteResults(res.result))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 기본값: 프론트 fallback (백엔드 응답 전/실패 시 사용)
    selectedModeRef.current = selectGameByCount(total);

    if (!isTie && winner && roomId && !penaltyRequestedRef.current) {
      penaltyRequestedRef.current = true;
      penaltyApi
        .drawPenaltyUser(roomId)
        .then((res) => {
          setLoser('', res.result.nickName);
          if (res.result.drawUserList.length > 0) {
            setParticipants(
              res.result.drawUserList.map((nickname, index) => ({
                id: `draw-${roomId}-${index}`,
                nickname,
                isHost: false,
                isConnected: true,
              }))
            );
            // 백엔드가 정한 벌칙자 인덱스(룰렛/사다리가 이 사람에게 도착하도록)
            setLoserIndex(
              typeof res.result.winnerIndex === 'number' ? res.result.winnerIndex : null
            );
          }
          // 백엔드가 정한 게임타입이 있으면 우선 적용
          const mode = mapPenaltyType(res.result.penaltyType);
          if (mode) selectedModeRef.current = mode;
        })
        .catch(() => {});
    }
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

  const getCreamImage = () => {
    if (winner?.label === '추워요') return creamCold;
    if (winner?.label === '더워요') return creamHot;
    return creamDefault;
  };

  const resultText = winner ? `${winner.label}!가 이겼어요` : '비겼어요';
  const subtitleText = isTie ? '재투표까지' : '다음 추첨 시작까지';

  return (
    <main className="flex flex-col flex-1 min-h-0 gap-2">
      {/* 배지 */}
      <div className="flex justify-center">
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          투표 결과
        </div>
      </div>

      {/* 제목 + 카운트다운 */}
      <section className="flex flex-col items-center gap-1">
        <p className="text-xl font-bold text-gray-900">투표 마감</p>
        <p className="text-sm text-gray-400">{subtitleText}</p>
        <p className="text-[clamp(72px,13svh,110px)] leading-none font-black text-gray-900">
          {countdown}
        </p>
      </section>

      {/* 크림 캐릭터 */}
      <div className="flex justify-center -my-1">
        <img
          src={getCreamImage()}
          alt="크림 캐릭터"
          className="w-[clamp(170px,27svh,250px)] h-auto aspect-square object-contain"
        />
      </div>

      {/* 결과 텍스트 */}
      <section className="flex flex-col items-center gap-1">
        <p className="text-[clamp(22px,3.5svh,30px)] leading-tight font-black text-gray-900 text-center">
          {resultText}
        </p>
      </section>

      {/* 투표 바 */}
      <section className="flex flex-col gap-2 px-2">
        <p className="text-lg font-bold text-gray-500 text-center">{question}</p>
        <p className="text-sm text-gray-400 text-center mb-1">
          총 {total}명 참여 · {displayResults.map((r) => `${r.label} ${r.count}`).join(' / ')}
        </p>

        {displayResults.map((result) => {
          const percentage = total > 0 ? Math.round((result.count / total) * 100) : 0;
          return (
            <div key={result.label} className="flex flex-col gap-1 mb-1">
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

    </main>
  );
}
