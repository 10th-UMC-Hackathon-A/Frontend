import { useState } from 'react';
import { gameApi } from '../api/gameApi';
import { useGameStore } from '../store/gameStore';
import type { GamePhase } from '../types/game';

export const useGame = (roomId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentPhase, setCurrentPhase, setLoser, setPunishment } = useGameStore();

  const startGame = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await gameApi.startGame(roomId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getGameState = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const state = await gameApi.getGameState(roomId);
      if (state.phase) {
        setCurrentPhase(state.phase as GamePhase);
      }
      return state;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get game state');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const submitGameAction = async (action: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await gameApi.submitGameAction(roomId, action);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit action');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentPhase,
    isLoading,
    error,
    startGame,
    getGameState,
    submitGameAction,
    setCurrentPhase,
    setLoser,
    setPunishment,
  };
};
