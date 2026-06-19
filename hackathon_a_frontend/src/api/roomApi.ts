import axiosInstance from './axiosInstance';
import { dummyRoomApi } from './dummy/room.dummy';
import type { CreateRoomResponse, GetRoomsResponse, DeleteRoomResponse, JoinParticipantResponse } from '../types/room';

// 테스트용 더미: USE_DUMMY 플래그로 실제 API/더미 API 분기
const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_API === 'true';

export const roomApi = {
  createRoom: async (roomName: string): Promise<CreateRoomResponse> => {
    // 테스트용 더미
    if (USE_DUMMY) return dummyRoomApi.createRoom(roomName);

    const response = await axiosInstance.post<CreateRoomResponse>('/rooms', { roomName });
    return response.data;
  },

  deleteRoom: async (roomId: number): Promise<DeleteRoomResponse> => {
    // 테스트용 더미
    if (USE_DUMMY) return dummyRoomApi.deleteRoom(roomId);

    const response = await axiosInstance.delete<DeleteRoomResponse>(`/rooms/${roomId}`);
    return response.data;
  },

  updateRoom: async (roomId: number, roomName: string): Promise<CreateRoomResponse> => {
    // 테스트용 더미
    if (USE_DUMMY) return dummyRoomApi.updateRoom(roomId, roomName);

    const response = await axiosInstance.patch<CreateRoomResponse>(`/rooms/${roomId}`, { roomName });
    return response.data;
  },

  getRooms: async (): Promise<GetRoomsResponse> => {
    // 테스트용 더미
    if (USE_DUMMY) return dummyRoomApi.getRooms();

    const response = await axiosInstance.get<GetRoomsResponse>('/rooms');
    return response.data;
  },

  joinParticipant: async (nickName: string, roomId: number): Promise<JoinParticipantResponse> => {
    // 테스트용 더미
    if (USE_DUMMY) return dummyRoomApi.joinParticipant(nickName, roomId);

    const response = await axiosInstance.post<JoinParticipantResponse>('/rooms/participants', { nickName, roomId });
    return response.data;
  },

};
