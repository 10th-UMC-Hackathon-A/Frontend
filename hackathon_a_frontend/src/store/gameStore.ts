import { create } from 'zustand';
import type { GamePhase } from '../types/game';

type MiniGameMode = 'bomb' | 'roulette' | 'ladder';

interface GameState {
  currentPhase: GamePhase;
  miniGameMode: MiniGameMode | null;
  loserId: string | null;
  loserNickname: string | null;
  punishment: string | null;
  punishmentSeconds: number;

  setCurrentPhase: (phase: GamePhase) => void;
  setMiniGameMode: (mode: MiniGameMode) => void;
  setLoser: (id: string, nickname: string) => void;
  setPunishment: (punishment: string, seconds?: number) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  currentPhase: 'nickname' as GamePhase,
  miniGameMode: null,
  loserId: null,
  loserNickname: null,
  punishment: null,
  punishmentSeconds: 300,
};

export const useGameStore = create<GameState>((set) => ({
  ...INITIAL_STATE,

  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  setMiniGameMode: (mode) => set({ miniGameMode: mode }),
  setLoser: (id, nickname) => set({ loserId: id, loserNickname: nickname }),
  setPunishment: (punishment, seconds = 300) => set({ punishment, punishmentSeconds: seconds }),
  reset: () => set(INITIAL_STATE),
}));
