import { create } from 'zustand';
import type { VoteResult } from '../types/vote';

interface VoteOption {
  id: string;
  label: string;
}

interface VoteState {
  question: string | null;
  options: VoteOption[];
  myVote: string | null; // selected option id
  voteResults: VoteResult[];
  isComplete: boolean;

  setQuestion: (question: string) => void;
  setOptions: (options: VoteOption[]) => void;
  setMyVote: (optionId: string) => void;
  setVoteResults: (results: VoteResult[]) => void;
  setIsComplete: (isComplete: boolean) => void;
  reset: () => void;
}

export const useVoteStore = create<VoteState>((set) => ({
  question: null,
  options: [],
  myVote: null,
  voteResults: [],
  isComplete: false,

  setQuestion: (question) => set({ question }),
  setOptions: (options) => set({ options }),
  setMyVote: (optionId) => set({ myVote: optionId }),
  setVoteResults: (results) => set({ voteResults: results }),
  setIsComplete: (isComplete) => set({ isComplete }),
  reset: () => set({ question: null, options: [], myVote: null, voteResults: [], isComplete: false }),
}));
