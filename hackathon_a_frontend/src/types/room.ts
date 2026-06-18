export interface RoomItem {
  roomId: number;
  roomName: string;
}

export interface CreateRoomResponse {
  message: string;
  error: null | string;
  data: RoomItem;
}

export interface GetRoomsResponse {
  code: string;
  message: string;
  error: null | string;
  data: RoomItem[];
}

export interface DeleteRoomResponse {
  message: string;
  error: null | string;
  data: null;
}

export interface JoinParticipantResponse {
  message: string;
  error: null | string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface Participant {
  id: string;
  nickname: string;
  isHost: boolean;
  isConnected: boolean;
}
