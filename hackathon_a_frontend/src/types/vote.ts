export interface VoteResultItem {
  label: string;
  count: number;
}

export interface SubmitVoteResponse {
  message: string;
  error: null | string;
  data: VoteResultItem[];
}

export interface VoteMemberItem {
  label: string;
  participateList: string[];
}

export interface GetVoteMembersResponse {
  message: string;
  error: null | string;
  data: VoteMemberItem[];
}
