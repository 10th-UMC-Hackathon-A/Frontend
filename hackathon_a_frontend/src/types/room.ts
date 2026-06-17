export interface Room {
  id: string;
  participants: Participant[];
  createdAt: string;
  status: 'waiting' | 'in-progress' | 'completed';
}

export interface Participant {
  id: string;
  nickname: string;
  isHost: boolean;
  isConnected: boolean;
}
