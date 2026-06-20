export interface RoomItem {
  roomId: number;
  roomName: string;
}

export interface CreateRoomResponse {
  timestamp: string;
  code: string;
  message: string;
  result: RoomItem;
}

export interface GetRoomsResponse {
  timestamp: string;
  code: string;
  message: string;
  result: RoomItem[];
}

export interface DeleteRoomResponse {
  timestamp: string;
  code: string;
  message: string;
  result: null;
}

export interface ParticipantResDto {
  userId: number;
  roomId: number;
  nickName: string;
  uid: string;
  accessToken: string;
}

export interface JoinParticipantResponse {
  timestamp: string;
  code: string;
  message: string;
  result: ParticipantResDto;
}

export interface Participant {
  id: string;
  nickname: string;
  isHost: boolean;
  isConnected: boolean;
}
