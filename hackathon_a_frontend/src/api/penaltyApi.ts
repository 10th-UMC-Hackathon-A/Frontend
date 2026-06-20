import axiosInstance from './axiosInstance';
import { dummyPenaltyApi } from './dummy/penalty.dummy';
import type {
  CreatePenaltyResponse,
  GetPenaltiesResponse,
  UpdatePenaltyResponse,
  DeletePenaltyResponse,
  DrawPenaltyResponse,
  DrawPenaltyUserResponse,
  MissionCompleteResponse,
} from '../types/penalty';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_API === 'true';

export const penaltyApi = {
  createPenalty: async (label: string): Promise<CreatePenaltyResponse> => {
    if (USE_DUMMY) return dummyPenaltyApi.createPenalty(label);
    const response = await axiosInstance.post<CreatePenaltyResponse>('/penalties', { label });
    return response.data;
  },

  getPenalties: async (): Promise<GetPenaltiesResponse> => {
    if (USE_DUMMY) return dummyPenaltyApi.getPenalties();
    const response = await axiosInstance.get<GetPenaltiesResponse>('/penalties');
    return response.data;
  },

  updatePenalty: async (penaltyId: number, label: string): Promise<UpdatePenaltyResponse> => {
    if (USE_DUMMY) return dummyPenaltyApi.updatePenalty(penaltyId, label);
    const response = await axiosInstance.patch<UpdatePenaltyResponse>('/penalties/update', { penaltyId, label });
    return response.data;
  },

  deletePenalty: async (penaltyId: number): Promise<DeletePenaltyResponse> => {
    if (USE_DUMMY) return dummyPenaltyApi.deletePenalty(penaltyId);
    const response = await axiosInstance.delete<DeletePenaltyResponse>(`/penalties/${penaltyId}`);
    return response.data;
  },

  drawPenalty: async (roomId: number): Promise<DrawPenaltyResponse> => {
    if (USE_DUMMY) return dummyPenaltyApi.drawPenalty(roomId);
    const response = await axiosInstance.post<DrawPenaltyResponse>('/penalties/draw', null, { params: { roomId } });
    return response.data;
  },

  drawPenaltyUser: async (roomId: number): Promise<DrawPenaltyUserResponse> => {
    if (USE_DUMMY) return dummyPenaltyApi.drawPenaltyUser(roomId);
    const response = await axiosInstance.post<DrawPenaltyUserResponse>('/penalties/draw-user', null, { params: { roomId } });
    return response.data;
  },

  missionComplete: async (roomId: number): Promise<MissionCompleteResponse> => {
    if (USE_DUMMY) return dummyPenaltyApi.missionComplete(roomId);
    const response = await axiosInstance.post<MissionCompleteResponse>('/penalties/mission-complete', null, { params: { roomId } });
    return response.data;
  },
};
