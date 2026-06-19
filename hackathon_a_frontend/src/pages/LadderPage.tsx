// src/pages/LadderPage.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateLadder, tracePath, type LadderData, type PathPoint } from '../utils/ladder';

const ROW_COUNT = 6;

interface Props {
  participantCount?: number;
}
export default function LadderPage({ participantCount = 4 }: Props) {
  const count = Math.min(participantCount, 5);
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  const [ladder, setLadder] = useState<LadderData>(() => generateLadder(count, ROW_COUNT));
  const ladderRef = useRef<LadderData>(ladder);

  const [isAnimating, setIsAnimating] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const getLayout = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const W = canvas.width;
    const H = canvas.height;
    const padX = 32;
    const padY = 24;
    const colGap = (W - padX * 2) / (count - 1);
    const rowGap = (H - padY * 2) / ROW_COUNT;
    return { W, H, padX, padY, colGap, rowGap };
  };

  const colX = (col: number, padX: number, colGap: number) => padX + col * colGap;
  const rowY = (row: number, padY: number, rowGap: number) => padY + row * rowGap;

  function drawLadder(data: LadderData, points: PathPoint[] | null, progress: number | null) {
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
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 3;
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
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 3;
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
      ctx.lineWidth = 4;
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
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const observer = new ResizeObserver(() => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight || 240;
      drawLadder(ladderRef.current, null, null);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleStart = () => {
    if (isAnimating) return;

    if (animDone) {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight || 240;
      }
      const newLadder = generateLadder(count, ROW_COUNT);
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
    const duration = 2000;
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
        setTimeout(() => setShowResult(true), 600);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  };

  if (showResult && winnerIdx !== null) {
    const winnerName = ladder.participants[winnerIdx];
    return (
      <div className="flex flex-col flex-1 gap-6">
        <div className="flex justify-center">
          <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
            투표 결과
          </div>
        </div>
        <p className="text-center text-sm text-gray-400">두구두구... 벌칙자는?</p>
        <div className="relative bg-blue-500 rounded-2xl p-6 flex flex-col items-center gap-2">
          <span className="absolute top-4 right-4 text-white font-bold text-lg">{count}</span>
          <div className="w-20 h-20 bg-gray-200 rounded-full" />
          <p className="text-2xl font-black text-white mt-1">{winnerName}</p>
          <p className="text-white font-semibold">당첨!</p>
          <p className="text-blue-200 text-sm">사다리 결과로 선정되었어요</p>
        </div>
        <div className="flex flex-col items-center gap-3 mt-2">
          <p className="text-base font-semibold text-gray-800">다음 화면에서 미션을 확인하세요</p>
          <div className="w-24 h-24 bg-gray-200 rounded-xl" />
        </div>
        <button
          onClick={() => navigate('/final')}
          className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold mt-auto"
        >
          미션 확인하기
        </button>
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
          <div className="flex justify-between px-3.5">
            {ladder.results.map((r, i) => (
              <div
                key={i}
                className={`px-3 py-1 rounded-lg text-sm font-semibold
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
            style={{ minHeight: '200px' }}
          >
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          {/* 하단: 참가자 */}
          <div className="flex justify-between px-2">
            {ladder.participants.map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full
                  ${animDone && winnerIdx === i ? 'bg-blue-500' : 'bg-gray-300'}`}
                />
                <span className="text-xs text-gray-500">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-400">'당첨'에 도착한 사람이 벌칙자!</p>
      </div>

      <button
        onClick={handleStart}
        disabled={isAnimating}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition mt-4"
      >
        {animDone ? '다시 하기' : '사다리 타기'}
      </button>
    </div>
  );
}
