import axiosInstance from './axiosInstance';
import type { SubmitVoteResponse, GetVoteMembersResponse } from '../types/vote';

export const voteApi = {
  submitVote: async (roomId: number, position: string): Promise<SubmitVoteResponse> => {
    const response = await axiosInstance.post<SubmitVoteResponse>('/rooms/vote', { roomId, position });
    return response.data;
  },

  getVoteStatus: async (roomId: number): Promise<SubmitVoteResponse> => {
    const response = await axiosInstance.get<SubmitVoteResponse>('/rooms/vote', { params: { roomId } });
    return response.data;
  },

  getVoteMembers: async (roomId: number): Promise<GetVoteMembersResponse> => {
    const response = await axiosInstance.get<GetVoteMembersResponse>('/rooms/vote-members', { params: { roomId } });
    return response.data;
  },
};
