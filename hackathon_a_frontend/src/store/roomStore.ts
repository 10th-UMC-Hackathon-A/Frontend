import { create } from 'zustand';

interface RoomState {
  roomId: string | null;
  participants: string[];
  setRoomId: (roomId: string) => void;
  setParticipants: (participants: string[]) => void;
  addParticipant: (participant: string) => void;
  removeParticipant: (participant: string) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  roomId: null,
  participants: [],

  setRoomId: (roomId) => set({ roomId }),

  setParticipants: (participants) => set({ participants }),

  addParticipant: (participant) =>
    set((state) => ({
      participants: [...state.participants, participant],
    })),

  removeParticipant: (participant) =>
    set((state) => ({
      participants: state.participants.filter((p) => p !== participant),
    })),
}));
