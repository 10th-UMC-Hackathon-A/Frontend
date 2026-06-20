import type {
  CreatePenaltyResponse,
  GetPenaltiesResponse,
  UpdatePenaltyResponse,
  DeletePenaltyResponse,
  PenaltyItem,
  DrawPenaltyResponse,
  DrawPenaltyUserResponse,
  MissionCompleteResponse,
} from '../../types/penalty';

let nextId = 4;
const dummyPenalties: PenaltyItem[] = [
  { penaltyId: 1, label: '에어컨 1도 조절하기' },
  { penaltyId: 2, label: '팔굽혀펴기 10개' },
  { penaltyId: 3, label: '노래 한 소절 부르기' },
];

const DUMMY_PARTICIPANTS = ['도로로', '기로로', '케로로', '타마마', '쿠루루'];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const dummyPenaltyApi = {
  createPenalty: async (label: string): Promise<CreatePenaltyResponse> => {
    await delay();
    const penalty: PenaltyItem = { penaltyId: nextId++, label };
    dummyPenalties.push(penalty);
    return { timestamp: new Date().toISOString(), code: '200', message: 'OK', result: penalty };
  },

  getPenalties: async (): Promise<GetPenaltiesResponse> => {
    await delay();
    return { timestamp: new Date().toISOString(), code: '200', message: 'OK', result: [...dummyPenalties] };
  },

  updatePenalty: async (penaltyId: number, label: string): Promise<UpdatePenaltyResponse> => {
    await delay();
    const penalty = dummyPenalties.find((p) => p.penaltyId === penaltyId);
    if (penalty) penalty.label = label;
    return { timestamp: new Date().toISOString(), code: '200', message: 'OK', result: penalty ?? { penaltyId, label } };
  },

  deletePenalty: async (penaltyId: number): Promise<DeletePenaltyResponse> => {
    await delay();
    const index = dummyPenalties.findIndex((p) => p.penaltyId === penaltyId);
    if (index !== -1) dummyPenalties.splice(index, 1);
    return { timestamp: new Date().toISOString(), code: '200', message: 'OK', result: null };
  },

  drawPenalty: async (roomId: number): Promise<DrawPenaltyResponse> => {
    await delay();
    const penaltyList = dummyPenalties.map((p) => p.label);
    const prizeIndex = Math.floor(Math.random() * penaltyList.length);
    return {
      timestamp: new Date().toISOString(), code: '200', message: 'OK',
      result: { roomId, drawRound: 1, label: penaltyList[prizeIndex], prizeIndex, penaltyList },
    };
  },

  drawPenaltyUser: async (roomId: number): Promise<DrawPenaltyUserResponse> => {
    await delay();
    const winnerIndex = Math.floor(Math.random() * DUMMY_PARTICIPANTS.length);
    return {
      timestamp: new Date().toISOString(), code: '200', message: 'OK',
      result: { roomId, drawRound: 1, nickName: DUMMY_PARTICIPANTS[winnerIndex], winnerIndex, drawUserList: DUMMY_PARTICIPANTS },
    };
  },

  missionComplete: async (roomId: number): Promise<MissionCompleteResponse> => {
    await delay();
    return { timestamp: new Date().toISOString(), code: '200', message: 'OK', result: { roomId } };
  },
};
