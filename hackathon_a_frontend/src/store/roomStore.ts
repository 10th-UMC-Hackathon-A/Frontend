import { create } from 'zustand';
import type { Participant } from '../types/room';

interface RoomState {
  roomId: string | null;
  hostId: string | null;
  participants: Participant[];

  setRoomId: (roomId: string) => void;
  setHostId: (hostId: string) => void;
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  reset: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  roomId: null,
  hostId: null,
  participants: [],

  setRoomId: (roomId) => set({ roomId }),
  setHostId: (hostId) => set({ hostId }),
  setParticipants: (participants) => set({ participants }),
  addParticipant: (participant) =>
    set((state) => ({ participants: [...state.participants, participant] })),
  removeParticipant: (participantId) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.id !== participantId),
    })),
  reset: () => set({ roomId: null, hostId: null, participants: [] }),
}));
