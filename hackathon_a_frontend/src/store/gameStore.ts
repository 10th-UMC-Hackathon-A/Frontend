import { create } from 'zustand';

type GamePhase = 'nickname' | 'vote' | 'vote-result' | 'bomb' | 'roulette' | 'ladder' | 'final';

interface GameState {
  currentPhase: GamePhase;
  winner: string | null;
  punishment: string | null;
  setCurrentPhase: (phase: GamePhase) => void;
  setWinner: (winner: string) => void;
  setPunishment: (punishment: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentPhase: 'nickname',
  winner: null,
  punishment: null,

  setCurrentPhase: (phase) => set({ currentPhase: phase }),

  setWinner: (winner) => set({ winner }),

  setPunishment: (punishment) => set({ punishment }),
}));
