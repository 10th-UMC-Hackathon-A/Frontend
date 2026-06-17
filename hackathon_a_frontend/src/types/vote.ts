export interface Vote {
  id: string;
  roomId: string;
  voterId: string;
  targetUserId: string;
  createdAt: string;
}

export interface VoteResult {
  userId: string;
  nickname: string;
  voteCount: number;
  percentage: number;
}

export interface VoteSession {
  roomId: string;
  votes: Vote[];
  results: VoteResult[];
  isComplete: boolean;
}
