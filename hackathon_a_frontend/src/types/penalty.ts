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
