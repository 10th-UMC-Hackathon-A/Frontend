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

// JoinParticipant 응답 필드명은 백엔드 확인 필요 (Swagger에 BaseResponseString으로만 표시)
export interface JoinParticipantResponse {
  timestamp: string;
  code: string;
  message: string;
  result: string;
}

export interface Participant {
  id: string;
  nickname: string;
  isHost: boolean;
  isConnected: boolean;
}
