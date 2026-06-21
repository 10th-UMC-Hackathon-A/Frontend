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

// 가로다리(bridges)를 따라 startCol에서 시작했을 때 도착하는 맨 아래 칸을 계산.
function traceFinalCol(startCol: number, bridges: Bridge[], rowCount: number): number {
  let col = startCol;
  for (let row = 0; row < rowCount; row++) {
    if (bridges.some((b) => b.row === row && b.col === col)) col += 1;
    else if (bridges.some((b) => b.row === row && b.col === col - 1)) col -= 1;
  }
  return col;
}

export function generateLadder(
  participantCount: number,
  rowCount = 6,
  names?: string[],
  // 도착(맨 아래)이 이 인덱스가 되도록 '당첨' 위치를 맞춘다. null이면 랜덤.
  winnerBottomIdx?: number | null
): LadderData {
  const participants = Array.from(
    { length: participantCount },
    (_, i) => names?.[i] ?? `참가자 ${i + 1}`
  );

  const bridges: Bridge[] = [];

  // 참가자가 2명 이상일 때만 가로다리를 만든다(1명이면 다리 없이 직선).
  if (participantCount >= 2) {
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

    // 총 bridge가 5개 미만이면 빈 슬롯을 찾아 추가 (꽉 차면 중단해 무한루프 방지)
    const MIN_TOTAL = 5;
    let guard = 0;
    while (bridges.length < MIN_TOTAL && guard < 200) {
      guard += 1;
      const row = Math.floor(Math.random() * rowCount);
      const usedInRow = new Set(bridges.filter(b => b.row === row).flatMap(b => [b.col, b.col + 1]));
      const freeCols = Array.from({ length: participantCount - 1 }, (_, i) => i)
        .filter(col => !usedInRow.has(col) && !usedInRow.has(col + 1));
      if (freeCols.length > 0) {
        const col = freeCols[Math.floor(Math.random() * freeCols.length)];
        bridges.push({ row, col });
      }
    }
  }

  // bridges가 정해진 뒤 '당첨' 위치 결정.
  // winnerBottomIdx가 주어지면 그 참가자(맨 아래 칸)에 도착하는 시작 칸에 '당첨'을 둔다.
  let winnerTopCol: number | null = null;
  if (
    winnerBottomIdx !== null &&
    winnerBottomIdx !== undefined &&
    winnerBottomIdx >= 0 &&
    winnerBottomIdx < participantCount
  ) {
    for (let tc = 0; tc < participantCount; tc++) {
      if (traceFinalCol(tc, bridges, rowCount) === winnerBottomIdx) {
        winnerTopCol = tc;
        break;
      }
    }
  }
  if (winnerTopCol === null) {
    winnerTopCol = Math.floor(Math.random() * participantCount);
  }

  const results = Array.from({ length: participantCount }, (_, i) =>
    i === winnerTopCol ? '당첨' : '꽝'
  );

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