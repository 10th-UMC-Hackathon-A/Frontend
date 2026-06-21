// src/utils/ladder.ts

export interface LadderData {
  participants: string[];
  results: string[];
  bridges: Bridge[];
}

export interface Bridge {
  row: number;
  col: number;
}

export interface PathPoint {
  x: number;
  y: number;
}

export function generateLadder(participantCount: number, rowCount = 6, names?: string[]): LadderData {
  const participants = Array.from(
    { length: participantCount },
    (_, i) => names?.[i] ?? `참가자 ${i + 1}`
  );

  const winnerIdx = Math.floor(Math.random() * participantCount);
  const results = Array.from({ length: participantCount }, (_, i) =>
    i === winnerIdx ? '당첨' : '꽝'
  );

  const bridges: Bridge[] = [];

  for (let row = 0; row < rowCount; row++) {
    const usedCols = new Set<number>();

    // 랜덤 bridge 생성
    for (let col = 0; col < participantCount - 1; col++) {
      if (!usedCols.has(col) && !usedCols.has(col + 1) && Math.random() > 0.5) {
        bridges.push({ row, col });
        usedCols.add(col);
        usedCols.add(col + 1);
      }
    }

    // 행에 bridge가 없으면 랜덤 위치에 하나 강제 추가
    if (!bridges.some(b => b.row === row)) {
      const col = Math.floor(Math.random() * (participantCount - 1));
      bridges.push({ row, col });
    }
  }

  // 총 bridge가 5개 미만이면 빈 슬롯을 찾아 추가
  const MIN_TOTAL = 5;
  while (bridges.length < MIN_TOTAL) {
    const row = Math.floor(Math.random() * rowCount);
    const usedInRow = new Set(bridges.filter(b => b.row === row).flatMap(b => [b.col, b.col + 1]));
    const freeCols = Array.from({ length: participantCount - 1 }, (_, i) => i)
      .filter(col => !usedInRow.has(col) && !usedInRow.has(col + 1));
    if (freeCols.length > 0) {
      const col = freeCols[Math.floor(Math.random() * freeCols.length)];
      bridges.push({ row, col });
    }
  }

  return { participants, results, bridges };
}

export function tracePath(
  startCol: number,
  ladder: LadderData,
  rowCount: number,
  padX: number,
  padY: number,
  colGap: number,
  rowGap: number
): PathPoint[] {
  const { bridges } = ladder;
  const points: PathPoint[] = [];
  let col = startCol;

  const colX = (c: number) => padX + c * colGap;
  const rowY = (r: number) => padY + r * rowGap;

  for (let row = 0; row < rowCount; row++) {
    points.push({ x: colX(col), y: rowY(row) });

    const rightBridge = bridges.find(b => b.row === row && b.col === col);
    const leftBridge = bridges.find(b => b.row === row && b.col === col - 1);

    if (rightBridge) {
      points.push({ x: colX(col), y: rowY(row) + rowGap / 2 });
      points.push({ x: colX(col + 1), y: rowY(row) + rowGap / 2 });
      col += 1;
    } else if (leftBridge) {
      points.push({ x: colX(col), y: rowY(row) + rowGap / 2 });
      points.push({ x: colX(col - 1), y: rowY(row) + rowGap / 2 });
      col -= 1;
    }
  }

  points.push({ x: colX(col), y: rowY(rowCount) });

  return points;
}