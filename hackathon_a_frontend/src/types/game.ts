export type GamePhase =
  | 'nickname'
  | 'vote'
  | 'vote-result'
  | 'bomb'
  | 'roulette'
  | 'ladder'
  | 'final';

export interface GameState {
  roomId: string;
  phase: GamePhase;
  currentPlayer?: string;
  winner?: string;
  punishment?: string;
}

export interface BombGame {
  totalCards: number;
  bombPositions: number[];
  revealedCards: number[];
  currentPlayer: string;
}

export interface RouletteGame {
  participants: string[];
  selectedIndex?: number;
  isSpinning: boolean;
}

export interface LadderGame {
  participants: string[];
  destinations: string[];
  connections: number[][];
  results?: Map<string, string>;
}
