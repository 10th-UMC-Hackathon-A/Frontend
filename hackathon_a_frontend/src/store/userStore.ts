import { create } from 'zustand';

interface UserState {
  userId: string | null;
  nickname: string | null;
  setUserId: (userId: string) => void;
  setNickname: (nickname: string) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  nickname: null,

  setUserId: (userId) => set({ userId }),
  setNickname: (nickname) => set({ nickname }),
  reset: () => set({ userId: null, nickname: null }),
}));
