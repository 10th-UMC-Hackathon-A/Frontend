import type {
  CreateRoomResponse,
  GetRoomsResponse,
  DeleteRoomResponse,
  JoinParticipantResponse,
  RoomItem,
} from '../../types/room';

const dummyRooms: RoomItem[] = [
  { roomId: 1, roomName: 'AI 공학관 502호 강의실' },
  { roomId: 2, roomName: 'AI 공학관 503호 강의실' },
];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const dummyRoomApi = {
  createRoom: async (roomName: string): Promise<CreateRoomResponse> => {
    await delay();
    const roomId = dummyRooms.length + 1;
    const room: RoomItem = { roomId, roomName };
    dummyRooms.push(room);
    return { timestamp: new Date().toISOString(), code: '200', message: 'OK', result: room };
  },

  deleteRoom: async (roomId: number): Promise<DeleteRoomResponse> => {
    await delay();
    const index = dummyRooms.findIndex((room) => room.roomId === roomId);
    if (index !== -1) dummyRooms.splice(index, 1);
    return { timestamp: new Date().toISOString(), code: '200', message: 'OK', result: null };
  },

  updateRoom: async (roomId: number, roomName: string): Promise<CreateRoomResponse> => {
    await delay();
    const room = dummyRooms.find((room) => room.roomId === roomId);
    if (room) room.roomName = roomName;
    return {
      timestamp: new Date().toISOString(),
      code: '200',
      message: 'OK',
      result: room ?? { roomId, roomName },
    };
  },

  getRooms: async (): Promise<GetRoomsResponse> => {
    await delay();
    return { timestamp: new Date().toISOString(), code: '200', message: 'OK', result: dummyRooms };
  },

  joinParticipant: async (nickName: string, roomId: number): Promise<JoinParticipantResponse> => {
    await delay();
    return {
      timestamp: new Date().toISOString(),
      code: '200',
      message: 'OK',
      result: `dummy-token-${roomId}-${nickName}-${Date.now()}`,
    };
  },
};
