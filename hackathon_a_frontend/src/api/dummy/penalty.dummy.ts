import type {
  CreatePenaltyResponse,
  GetPenaltiesResponse,
  UpdatePenaltyResponse,
  DeletePenaltyResponse,
  PenaltyItem,
} from '../../types/penalty';

const dummyPenalties: PenaltyItem[] = [
  { penaltyId: 1, label: '에어컨 1도 조절하기' },
  { penaltyId: 2, label: '팔굽혀펴기 10개' },
  { penaltyId: 3, label: '노래 한 소절 부르기' },
];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const dummyPenaltyApi = {
  createPenalty: async (label: string): Promise<CreatePenaltyResponse> => {
    await delay();
    const penaltyId = Date.now();
    const penalty: PenaltyItem = { penaltyId, label };
    dummyPenalties.push(penalty);
    return { code: '200', message: 'OK', error: null, data: penalty };
  },

  getPenalties: async (): Promise<GetPenaltiesResponse> => {
    await delay();
    return { code: '200', message: 'OK', error: null, data: [...dummyPenalties] };
  },

  updatePenalty: async (penaltyId: number, label: string): Promise<UpdatePenaltyResponse> => {
    await delay();
    const penalty = dummyPenalties.find((p) => p.penaltyId === penaltyId);
    if (penalty) penalty.label = label;
    return { code: '200', message: 'OK', error: null, data: penalty ?? { penaltyId, label } };
  },

  deletePenalty: async (penaltyId: number): Promise<DeletePenaltyResponse> => {
    await delay();
    const index = dummyPenalties.findIndex((p) => p.penaltyId === penaltyId);
    if (index !== -1) dummyPenalties.splice(index, 1);
    return { code: '200', message: 'OK', error: null, data: null };
  },
};
