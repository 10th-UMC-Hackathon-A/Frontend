export interface PenaltyItem {
  penaltyId: number;
  label: string;
}

export interface CreatePenaltyResponse {
  code: string;
  message: string;
  error: null | string;
  data: PenaltyItem;
}

export interface GetPenaltiesResponse {
  code: string;
  message: string;
  error: null | string;
  data: PenaltyItem[];
}

export interface UpdatePenaltyResponse {
  code: string;
  message: string;
  error: null | string;
  data: PenaltyItem;
}

export interface DeletePenaltyResponse {
  code: string;
  message: string;
  error: null | string;
  data: null;
}
