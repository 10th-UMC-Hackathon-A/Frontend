import { create } from 'zustand';
import type { GamePhase } from '../types/game';

type MiniGameMode = 'bomb' | 'roulette' | 'ladder';

interface GameState {
  currentPhase: GamePhase;
  miniGameMode: MiniGameMode | null;
  winnerVoteLabel: string | null;
  loserId: string | null;
  loserNickname: string | null;
  loserIndex: number | null;
  punishment: string | null;
  punishmentSeconds: number;

  setCurrentPhase: (phase: GamePhase) => void;
  setMiniGameMode: (mode: MiniGameMode) => void;
  setWinnerVoteLabel: (label: string) => void;
  setLoser: (id: string, nickname: string) => void;
  setLoserIndex: (index: number | null) => void;
  setPunishment: (punishment: string, seconds?: number) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  currentPhase: 'nickname' as GamePhase,
  miniGameMode: null,
  winnerVoteLabel: null,
  loserId: null,
  loserNickname: null,
  loserIndex: null,
  punishment: null,
  punishmentSeconds: 300,
};

export const useGameStore = create<GameState>((set) => ({
  ...INITIAL_STATE,

  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  setMiniGameMode: (mode) => set({ miniGameMode: mode }),
  setWinnerVoteLabel: (label) => set({ winnerVoteLabel: label }),
  setLoser: (id, nickname) => set({ loserId: id, loserNickname: nickname }),
  setLoserIndex: (index) => set({ loserIndex: index }),
  setPunishment: (punishment, seconds = 300) => set({ punishment, punishmentSeconds: seconds }),
  reset: () => set(INITIAL_STATE),
}));
