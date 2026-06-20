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
    for (let col = 0; col < participantCount - 1; col++) {
      if (!usedCols.has(col) && !usedCols.has(col - 1) && Math.random() > 0.5) {
        bridges.push({ row, col });
        usedCols.add(col);
        usedCols.add(col + 1);
      }
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