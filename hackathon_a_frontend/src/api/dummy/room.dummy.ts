import type {
  CreateRoomResponse,
  GetRoomsResponse,
  DeleteRoomResponse,
  JoinParticipantResponse,
  RoomItem,
} from '../../types/room';

// 테스트용 더미: 메모리에만 유지되는 방 목록 (NicknamePage 화면 문구와 동일하게 맞춤)
const dummyRooms: RoomItem[] = [{ roomId: 1, roomName: '가천대학교 502호 강의실' }];

// 테스트용 더미: 실제 네트워크 지연을 흉내 내기 위한 헬퍼
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const dummyRoomApi = {
  createRoom: async (roomName: string): Promise<CreateRoomResponse> => {
    await delay();
    const roomId = Date.now();
    const room: RoomItem = { roomId, roomName };
    dummyRooms.push(room);
    return { message: 'OK', error: null, data: room };
  },

  deleteRoom: async (roomId: number): Promise<DeleteRoomResponse> => {
    await delay();
    const index = dummyRooms.findIndex((room) => room.roomId === roomId);
    if (index !== -1) dummyRooms.splice(index, 1);
    return { message: 'OK', error: null, data: null };
  },

  updateRoom: async (roomId: number, roomName: string): Promise<CreateRoomResponse> => {
    await delay();
    const room = dummyRooms.find((room) => room.roomId === roomId);
    if (room) room.roomName = roomName;
    return { message: 'OK', error: null, data: room ?? { roomId, roomName } };
  },

  getRooms: async (): Promise<GetRoomsResponse> => {
    await delay();
    return { code: '200', message: 'OK', error: null, data: dummyRooms };
  },

  joinParticipant: async (nickName: string, roomId: number): Promise<JoinParticipantResponse> => {
    await delay();
    // 테스트용 더미: roomId 존재 여부와 무관하게 항상 입장 성공 처리
    return {
      message: 'OK',
      error: null,
      data: {
        accessToken: `dummy-access-token-${roomId}-${nickName}-${Date.now()}`,
        refreshToken: `dummy-refresh-token-${roomId}-${nickName}-${Date.now()}`,
      },
    };
  },
};
