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
  refreshToken: string;
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

export interface VerifyAccessResDto {
  nickName: string;
}

export interface VerifyAccessResponse {
  timestamp: string;
  code: string;
  message: string;
  result: VerifyAccessResDto;
}

export interface RoomDetailsResDto {
  roomId: number;
  roomName: string;
  voteStartedAt: string;
  voteClosedAt: string;
  drawRound: number;
  participantedUserCount: number;
}

export interface TokenRefreshResDto {
  accessToken: string;
  refreshToken: string;
}

export interface TokenRefreshResponse {
  timestamp: string;
  code: string;
  message: string;
  result: TokenRefreshResDto;
}

export interface GetRoomDetailsResponse {
  timestamp: string;
  code: string;
  message: string;
  result: RoomDetailsResDto;
}
