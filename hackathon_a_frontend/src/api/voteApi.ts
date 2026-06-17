import axiosInstance from './axiosInstance';

export const voteApi = {
  submitVote: async (roomId: string, targetUserId: string) => {
    const response = await axiosInstance.post(`/rooms/${roomId}/vote`, {
      targetUserId,
    });
    return response.data;
  },

  getVoteResults: async (roomId: string) => {
    const response = await axiosInstance.get(`/rooms/${roomId}/vote/results`);
    return response.data;
  },
};
