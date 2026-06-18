import { create } from 'zustand';

interface UserState {
  nickname: string | null;
  accessToken: string | null;
  refreshToken: string | null;

  setNickname: (nickname: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  nickname: null,
  accessToken: null,
  refreshToken: null,

  setNickname: (nickname) => set({ nickname }),
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  reset: () => set({ nickname: null, accessToken: null, refreshToken: null }),
}));
