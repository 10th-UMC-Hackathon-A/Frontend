import type { SubmitVoteResponse, GetVoteMembersResponse, VoteResultItem } from '../../types/vote';

// 테스트용 더미: roomId별 투표 결과를 메모리에 유지
const dummyVoteResultsByRoom = new Map<number, VoteResultItem[]>();

// 테스트용 더미: 해당 room의 결과가 없으면 기본 옵션으로 초기화
const getDummyResults = (roomId: number): VoteResultItem[] => {
  if (!dummyVoteResultsByRoom.has(roomId)) {
    dummyVoteResultsByRoom.set(roomId, [
      { label: '추워요', count: 0 },
      { label: '더워요', count: 0 },
    ]);
  }
  return dummyVoteResultsByRoom.get(roomId)!;
};

// 테스트용 더미: 실제 네트워크 지연을 흉내 내기 위한 헬퍼
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const dummyVoteApi = {
  submitVote: async (roomId: number, position: string): Promise<SubmitVoteResponse> => {
    await delay();
    const results = getDummyResults(roomId);
    const target = results.find((item) => item.label === position);
    if (target) {
      target.count += 1;
    } else {
      results.push({ label: position, count: 1 });
    }
    return { timestamp: new Date().toISOString(), code: '200', message: 'OK', result: results };
  },

  getVoteStatus: async (roomId: number): Promise<SubmitVoteResponse> => {
    await delay();
    return {
      timestamp: new Date().toISOString(),
      code: '200',
      message: 'OK',
      result: getDummyResults(roomId),
    };
  },

  getVoteMembers: async (roomId: number): Promise<GetVoteMembersResponse> => {
    await delay();
    const results = getDummyResults(roomId);
    return {
      message: 'OK',
      error: null,
      data: results.map((item) => ({ label: item.label, participateList: [] })),
    };
  },
};
