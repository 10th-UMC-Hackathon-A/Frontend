import axiosInstance from './axiosInstance';
import { dummyVoteApi } from './dummy/vote.dummy';
import type { SubmitVoteResponse, GetVoteMembersResponse } from '../types/vote';

// 테스트용 더미: USE_DUMMY 플래그로 실제 API/더미 API 분기
const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_API === 'true';

export const voteApi = {
  submitVote: async (roomId: number, position: string): Promise<SubmitVoteResponse> => {
    // 테스트용 더미
    if (USE_DUMMY) return dummyVoteApi.submitVote(roomId, position);

    const response = await axiosInstance.post<SubmitVoteResponse>('/rooms/vote', { roomId, position });
    return response.data;
  },

  getVoteStatus: async (roomId: number): Promise<SubmitVoteResponse> => {
    // 테스트용 더미
    if (USE_DUMMY) return dummyVoteApi.getVoteStatus(roomId);

    const response = await axiosInstance.get<SubmitVoteResponse>('/rooms/vote', { params: { roomId } });
    return response.data;
  },

  getVoteMembers: async (roomId: number): Promise<GetVoteMembersResponse> => {
    // 테스트용 더미
    if (USE_DUMMY) return dummyVoteApi.getVoteMembers(roomId);

    const response = await axiosInstance.get<GetVoteMembersResponse>('/rooms/vote-members', { params: { roomId } });
    return response.data;
  },
};
