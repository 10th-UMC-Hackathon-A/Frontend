// src/pages/LadderPage.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { generateLadder, tracePath, type LadderData, type PathPoint } from '../utils/ladder';
import { useRoomStore } from '../store/roomStore';
import { useGameStore } from '../store/gameStore';
import { FALLBACK_PARTICIPANT_NAMES } from '../constants/participants';
import creamYou from '../assets/images/Icon/Cream/You.png';
import creamCongrats from '../assets/images/Icon/Cream/Congrats.png';

const ROW_COUNT = 6;
const AUTO_SEC = 5;
const RESULT_AUTO_SEC = 10;

const colX = (col: number, padX: number, colGap: number) => padX + col * colGap;
const rowY = (row: number, padY: number, rowGap: number) => padY + row * rowGap;

export default function LadderPage() {
  const navigate = useNavigate();
  const { participants: storeParticipants } = useRoomStore();
  const { setLoser, loserIndex } = useGameStore();

  // 실제 추첨 후보(백엔드 drawUserList)를 그대로 사용. 데이터가 없을 때만 임시 이름 사용.
  const rawNames =
    storeParticipants.length >= 1
      ? storeParticipants.map((p) => p.nickname)
      : FALLBACK_PARTICIPANT_NAMES;
  const count = Math.min(rawNames.length, 5);
  const names = rawNames.slice(0, count);
  const namesRef = useRef(names);
  useEffect(() => {
    namesRef.current = names;
  });

  // 백엔드가 정한 벌칙자 인덱스(표시 범위 밖이면 무시 → 랜덤 당첨)
  const targetIdx = loserIndex !== null && loserIndex >= 0 && loserIndex < count ? loserIndex : null;
  const targetIdxRef = useRef(targetIdx);
  useEffect(() => {
    targetIdxRef.current = targetIdx;
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  const [ladder, setLadder] = useState<LadderData>(() =>
    generateLadder(count, ROW_COUNT, names, targetIdx)
  );
  const ladderRef = useRef<LadderData>(ladder);

  const [isAnimating, setIsAnimating] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startCountdown, setStartCountdown] = useState(AUTO_SEC);
  const [resultCountdown, setResultCountdown] = useState(RESULT_AUTO_SEC);

  const getLayout = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const W = canvas.width;
    const H = canvas.height;
    const padX = 32;
    const padY = 24;
    const colGap = (W - padX * 2) / (count - 1);
    const rowGap = (H - padY * 2) / ROW_COUNT;
    return { W, H, padX, padY, colGap, rowGap };
  }, [count]);

  const drawLadder = useCallback((data: LadderData, points: PathPoint[] | null, progress: number | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const layout = getLayout();
    if (!layout) return;
    const { W, H, padX, padY, colGap, rowGap } = layout;

    ctx.clearRect(0, 0, W, H);

    for (let c = 0; c < count; c++) {
      const x = colX(c, padX, colGap);
      ctx.beginPath();
      ctx.moveTo(x, padY);
      ctx.lineTo(x, padY + ROW_COUNT * rowGap);
      // gray-100 배경 위에서 잘 보이도록 gray-400로 대비 확보
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    for (const b of data.bridges) {
      const x1 = colX(b.col, padX, colGap);
      const x2 = colX(b.col + 1, padX, colGap);
      const y = rowY(b.row, padY, rowGap) + rowGap / 2;
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    if (points && progress !== null && points.length >= 2) {
      const totalSegments = points.length - 1;
      const targetIdx =
        progress >= 1 ? totalSegments : Math.max(0, Math.floor(progress * totalSegments));
      const partial = progress >= 1 ? 1 : progress * totalSegments - targetIdx;

      ctx.beginPath();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 0; i < targetIdx; i++) {
        ctx.lineTo(points[i + 1].x, points[i + 1].y);
      }

      if (targetIdx < totalSegments && targetIdx + 1 < points.length) {
        const from = points[targetIdx];
        const to = points[targetIdx + 1];
        ctx.lineTo(from.x + (to.x - from.x) * partial, from.y + (to.y - from.y) * partial);
      }

      ctx.stroke();
    }
  }, [count, getLayout]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const sizeAndDraw = () => {
      canvas.width = container.clientWidth || 300;
      canvas.height = container.clientHeight || 240;
      drawLadder(ladderRef.current, null, null);
    };

    const observer = new ResizeObserver(sizeAndDraw);
    observer.observe(container);
    // ResizeObserver 첫 콜백이 지연될 수 있어 마운트 직후 한 번 직접 그린다.
    sizeAndDraw();
    return () => observer.disconnect();
  }, [drawLadder]);

  const handleStart = () => {
    if (isAnimating) return;

    if (animDone) {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight || 240;
      }
      const currentNames = namesRef.current;
      const newLadder = generateLadder(
        currentNames.length,
        ROW_COUNT,
        currentNames,
        targetIdxRef.current
      );
      ladderRef.current = newLadder;
      setLadder(newLadder);
      setAnimDone(false);
      setWinnerIdx(null);
      setShowResult(false);
      drawLadder(newLadder, null, null);
      return;
    }

    const layout = getLayout();
    if (!layout || layout.colGap <= 0 || isNaN(layout.colGap)) return;
    const { padX, padY, colGap, rowGap } = layout;

    setIsAnimating(true);
    setStartCountdown(0);

    const winnerResultIdx = ladderRef.current.results.indexOf('당첨');
    const points = tracePath(
      winnerResultIdx,
      ladderRef.current,
      ROW_COUNT,
      padX,
      padY,
      colGap,
      rowGap
    );
    const duration = 4000;
    const start = performance.now();

    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      drawLadder(ladderRef.current, points, t);

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        const lastPoint = points[points.length - 1];
        const finalCol = Math.round((lastPoint.x - padX) / colGap);
        setWinnerIdx(finalCol);
        setAnimDone(true);
        setIsAnimating(false);
        setShowResult(true);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  };

  // 5초 후 자동 게임 시작
  useEffect(() => {
    if (showResult || isAnimating || animDone) return;
    if (startCountdown <= 0) {
      const t = setTimeout(() => handleStart(), 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStartCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startCountdown, showResult, isAnimating, animDone]);

  // 결과 화면: 5초 후 자동 /final 이동
  useEffect(() => {
    if (!showResult || winnerIdx === null) return;
    if (resultCountdown <= 0) {
      const winnerName = ladder.participants[winnerIdx];
      setLoser('', winnerName);
      navigate('/final');
      return;
    }
    const t = setTimeout(() => setResultCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResult, resultCountdown, winnerIdx]);

  if (showResult && winnerIdx !== null) {
    const winnerName = ladder.participants[winnerIdx];
    return (
      <div className="flex flex-col flex-1 min-h-0 gap-[clamp(8px,2svh,20px)]">
        <div className="flex justify-center">
          <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
            사다리 결과
          </div>
        </div>
        <p className="text-center text-lg font-semibold text-gray-500">두구두구... 벌칙자는?</p>
        <div className="relative mx-4 bg-blue-600 rounded-2xl px-6 py-[clamp(14px,2.5svh,26px)] flex flex-col items-center gap-2">
          <span className="absolute top-4 right-5 text-4xl font-black text-blue-200">
            {resultCountdown}
          </span>
          <div className="w-[clamp(96px,14svh,132px)] aspect-square bg-white rounded-full border-[5px] border-blue-100 flex items-center justify-center overflow-hidden">
            <img
              src={creamYou}
              alt="당첨된 크림 캐릭터"
              className="w-full h-full object-contain scale-110 translate-y-2"
            />
          </div>
          <p className="text-3xl font-black text-white mt-1">{winnerName}</p>
          <p className="text-white font-semibold">당첨!</p>
          <p className="text-blue-200 text-sm">사다리 결과로 선정되었어요</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-base font-semibold text-gray-800">잠시 후 미션 화면으로 이동합니다</p>
          <img
            src={creamCongrats}
            alt="축하 캐릭터"
            className="w-[clamp(105px,17svh,176px)] h-auto aspect-square object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 justify-between overflow-hidden">
      <div className="flex flex-col items-center gap-4 flex-1 overflow-hidden">
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          사다리 타기
        </div>
        <p className="text-lg font-bold text-gray-900">사다리를 타고 벌칙자를 정해요</p>

        <div className="w-full bg-gray-100 rounded-2xl p-4 flex flex-col gap-3 flex-1">
          {/* 상단: 결과 (꽝/당첨) */}
          <div className="flex justify-between">
            {ladder.results.map((r, i) => (
              <div
                key={i}
                className={`flex h-7.5 w-16 items-center justify-center rounded-lg text-sm font-semibold
                  ${r === '당첨' ? 'bg-blue-400 text-white' : 'bg-gray-300 text-gray-500'}`}
              >
                {r}
              </div>
            ))}
          </div>

          {/* 캔버스 */}
          <div
            ref={containerRef}
            className="w-full flex-1 flex flex-col"
            style={{ minHeight: 'clamp(150px, 27svh, 200px)' }}
          >
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          {/* 하단: 참가자 */}
          <div className="flex justify-between px-2">
            {ladder.participants.map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span
                  className={`text-xs truncate max-w-12 text-center font-medium
                  ${animDone && winnerIdx === i ? 'text-blue-500' : 'text-gray-500'}`}
                >
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-400">'당첨'에 도착한 사람이 벌칙자!</p>
      </div>

      <Button variant="blue" fullWidth disabled={isAnimating || animDone} onClick={handleStart} className="mt-2 shrink-0">
        {isAnimating ? '사다리 타는 중...' : `사다리 타기 (${startCountdown}초)`}
      </Button>
    </div>
  );
}
