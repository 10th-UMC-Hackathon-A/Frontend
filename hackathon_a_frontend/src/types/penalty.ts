export interface PenaltyItem {
  penaltyId: number;
  label: string;
}

export interface CreatePenaltyResponse {
  timestamp: string;
  code: string;
  message: string;
  result: PenaltyItem;
}

export interface GetPenaltiesResponse {
  timestamp: string;
  code: string;
  message: string;
  result: PenaltyItem[];
}

export interface UpdatePenaltyResponse {
  timestamp: string;
  code: string;
  message: string;
  result: PenaltyItem;
}

export interface DeletePenaltyResponse {
  timestamp: string;
  code: string;
  message: string;
  result: null;
}

export interface PenaltyDrawResultResDto {
  roomId: number;
  drawRound: number;
  label: string;
  prizeIndex: number;
  penaltyList: string[];
}

export interface DrawPenaltyResponse {
  timestamp: string;
  code: string;
  message: string;
  result: PenaltyDrawResultResDto;
}

export interface PenaltyUserDrawResultResDto {
  roomId: number;
  drawRound: number;
  nickName: string;
  winnerIndex: number;
  drawUserList: string[];
}

export interface DrawPenaltyUserResponse {
  timestamp: string;
  code: string;
  message: string;
  result: PenaltyUserDrawResultResDto;
}

export interface MissionCompleteResDto {
  roomId: number;
}

export interface MissionCompleteResponse {
  timestamp: string;
  code: string;
  message: string;
  result: MissionCompleteResDto;
}
