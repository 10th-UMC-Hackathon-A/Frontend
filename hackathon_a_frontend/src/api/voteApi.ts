import axiosInstance from './axiosInstance';
import { dummyVoteApi } from './dummy/vote.dummy';
import type { SubmitVoteResponse, GetVoteMembersResponse, GetVoteTypesResponse } from '../types/vote';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_API === 'true';

export const voteApi = {
  getVoteTypes: async (): Promise<GetVoteTypesResponse> => {
    if (USE_DUMMY) return dummyVoteApi.getVoteTypes();
    const response = await axiosInstance.get<GetVoteTypesResponse>('/rooms/vote-types');
    return response.data;
  },

  submitVote: async (roomId: number, position: string): Promise<SubmitVoteResponse> => {
    if (USE_DUMMY) return dummyVoteApi.submitVote(roomId, position);
    const response = await axiosInstance.post<SubmitVoteResponse>('/rooms/vote', { roomId, position });
    return response.data;
  },

  getVoteStatus: async (roomId: number): Promise<SubmitVoteResponse> => {
    if (USE_DUMMY) return dummyVoteApi.getVoteStatus(roomId);
    const response = await axiosInstance.get<SubmitVoteResponse>('/rooms/vote', { params: { roomId } });
    return response.data;
  },

  getVoteMembers: async (roomId: number): Promise<GetVoteMembersResponse> => {
    if (USE_DUMMY) return dummyVoteApi.getVoteMembers(roomId);
    const response = await axiosInstance.get<GetVoteMembersResponse>('/rooms/vote-members', { params: { roomId } });
    return response.data;
  },
};
