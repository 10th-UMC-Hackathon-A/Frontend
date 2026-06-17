import axiosInstance from './axiosInstance';

export const roomApi = {
  createRoom: async () => {
    const response = await axiosInstance.post('/rooms');
    return response.data;
  },

  joinRoom: async (roomId: string) => {
    const response = await axiosInstance.post(`/rooms/${roomId}/join`);
    return response.data;
  },

  getRoomInfo: async (roomId: string) => {
    const response = await axiosInstance.get(`/rooms/${roomId}`);
    return response.data;
  },
};
