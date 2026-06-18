import axiosInstance from './axiosInstance';

export const gameApi = {
  startGame: async (roomId: string) => {
    const response = await axiosInstance.post(`/rooms/${roomId}/game/start`);
    return response.data;
  },

  getGameState: async (roomId: string) => {
    const response = await axiosInstance.get(`/rooms/${roomId}/game/state`);
    return response.data;
  },

  submitGameAction: async (roomId: string, action: Record<string, unknown>) => {
    const response = await axiosInstance.post(`/rooms/${roomId}/game/action`, action);
    return response.data;
  },
};
