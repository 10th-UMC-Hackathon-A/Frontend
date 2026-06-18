import axiosInstance from './axiosInstance';
import type {
  CreatePenaltyResponse,
  GetPenaltiesResponse,
  UpdatePenaltyResponse,
  DeletePenaltyResponse,
} from '../types/penalty';

export const penaltyApi = {
  createPenalty: async (label: string): Promise<CreatePenaltyResponse> => {
    const response = await axiosInstance.post<CreatePenaltyResponse>('/penalties', { label });
    return response.data;
  },

  getPenalties: async (): Promise<GetPenaltiesResponse> => {
    const response = await axiosInstance.get<GetPenaltiesResponse>('/penalties');
    return response.data;
  },

  updatePenalty: async (penaltyId: number, label: string): Promise<UpdatePenaltyResponse> => {
    const response = await axiosInstance.patch<UpdatePenaltyResponse>('/penalties/update', { penaltyId, label });
    return response.data;
  },

  deletePenalty: async (penaltyId: number): Promise<DeletePenaltyResponse> => {
    const response = await axiosInstance.delete<DeletePenaltyResponse>(`/penalties/${penaltyId}`);
    return response.data;
  },
};
