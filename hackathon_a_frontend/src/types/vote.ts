export interface VoteResultItem {
  label: string;
  count: number;
}

export interface SubmitVoteResponse {
  timestamp: string;
  code: string;
  message: string;
  result: VoteResultItem[];
}

export interface VoteStatusWithAliasResDto {
  label: string;
  participateList: string[];
}

export interface GetVoteMembersResponse {
  timestamp: string;
  code: string;
  message: string;
  result: VoteStatusWithAliasResDto[];
}

export interface VoteTypeResDto {
  voteTypeId: number;
  label: string;
}

export interface GetVoteTypesResponse {
  timestamp: string;
  code: string;
  message: string;
  result: VoteTypeResDto[];
}
