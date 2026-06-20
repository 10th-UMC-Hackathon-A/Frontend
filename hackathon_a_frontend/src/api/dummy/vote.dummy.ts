import type { SubmitVoteResponse, GetVoteMembersResponse, GetVoteTypesResponse, VoteResultItem } from '../../types/vote';

const dummyVoteResultsByRoom = new Map<number, VoteResultItem[]>();

const getDummyResults = (roomId: number): VoteResultItem[] => {
  if (!dummyVoteResultsByRoom.has(roomId)) {
    dummyVoteResultsByRoom.set(roomId, [
      { label: '추워요', count: 0 },
      { label: '더워요', count: 0 },
    ]);
  }
  return dummyVoteResultsByRoom.get(roomId)!;
};

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const dummyVoteApi = {
  getVoteTypes: async (): Promise<GetVoteTypesResponse> => {
    await delay();
    return {
      timestamp: new Date().toISOString(), code: '200', message: 'OK',
      result: [
        { voteTypeId: 1, label: '추워요' },
        { voteTypeId: 2, label: '더워요' },
      ],
    };
  },

  submitVote: async (roomId: number, position: string): Promise<SubmitVoteResponse> => {
    await delay();
    const results = getDummyResults(roomId);
    const target = results.find((item) => item.label === position);
    if (target) target.count += 1;
    else results.push({ label: position, count: 1 });
    return { timestamp: new Date().toISOString(), code: '200', message: 'OK', result: results };
  },

  getVoteStatus: async (roomId: number): Promise<SubmitVoteResponse> => {
    await delay();
    return { timestamp: new Date().toISOString(), code: '200', message: 'OK', result: getDummyResults(roomId) };
  },

  getVoteMembers: async (roomId: number): Promise<GetVoteMembersResponse> => {
    await delay();
    const results = getDummyResults(roomId);
    return {
      timestamp: new Date().toISOString(), code: '200', message: 'OK',
      result: results.map((item) => ({ label: item.label, participateList: [] })),
    };
  },
};
