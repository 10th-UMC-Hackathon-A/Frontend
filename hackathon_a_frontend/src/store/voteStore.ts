import { create } from 'zustand';

interface VoteResult {
  userId: string;
  nickname: string;
  voteCount: number;
}

interface VoteState {
  selectedUserId: string | null;
  voteResults: VoteResult[];
  setSelectedUserId: (userId: string | null) => void;
  setVoteResults: (results: VoteResult[]) => void;
}

export const useVoteStore = create<VoteState>((set) => ({
  selectedUserId: null,
  voteResults: [],

  setSelectedUserId: (userId) => set({ selectedUserId: userId }),

  setVoteResults: (results) => set({ voteResults: results }),
}));
