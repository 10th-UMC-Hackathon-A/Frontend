import axiosInstance from './axiosInstance';
import type { CreateRoomResponse, GetRoomsResponse, DeleteRoomResponse, JoinParticipantResponse } from '../types/room';

export const roomApi = {
  createRoom: async (roomName: string): Promise<CreateRoomResponse> => {
    const response = await axiosInstance.post<CreateRoomResponse>('/rooms', { roomName });
    return response.data;
  },

  deleteRoom: async (roomId: number): Promise<DeleteRoomResponse> => {
    const response = await axiosInstance.delete<DeleteRoomResponse>(`/rooms/${roomId}`);
    return response.data;
  },

  updateRoom: async (roomId: number, roomName: string): Promise<CreateRoomResponse> => {
    const response = await axiosInstance.patch<CreateRoomResponse>(`/rooms/${roomId}`, { roomName });
    return response.data;
  },

  getRooms: async (): Promise<GetRoomsResponse> => {
    const response = await axiosInstance.get<GetRoomsResponse>('/rooms');
    return response.data;
  },

  joinParticipant: async (nickName: string, roomId: number): Promise<JoinParticipantResponse> => {
    const response = await axiosInstance.post<JoinParticipantResponse>('/rooms/participants', { nickName, roomId });
    return response.data;
  },

};
