import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVote } from '../hooks/useVote';
import { useRoomStore } from '../store/roomStore';
import { voteApi } from '../api/voteApi';
import type { VoteTypeResDto } from '../types/vote';
import creamDefault from '../assets/Cream/Default.png';
import creamCold from '../assets/Cream/Cold.png';
import creamHot from '../assets/Cream/Hot.png';

const question = 'Q. 지금 강의실 온도는 어때요?';

const DESCRIPTIONS: Record<string, string> = {
  '추워요': '에어컨 좀 줄여주세요 ㅜㅜ',
  '더워요': '에어컨 좀 켜주세요!!!',
};

const getCreamImage = (selected: string | null, types: VoteTypeResDto[]) => {
  if (!selected) return creamDefault;
  const type = types.find((t) => String(t.voteTypeId) === selected);
  if (type?.label === '추워요') return creamCold;
  if (type?.label === '더워요') return creamHot;
  return creamDefault;
};

export default function VotePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [voteTypes, setVoteTypes] = useState<VoteTypeResDto[]>([]);
  const navigate = useNavigate();
  const { roomId: storeRoomId } = useRoomStore();
  const roomId = storeRoomId ?? (Number(localStorage.getItem('roomId')) || null);
  const { submitVote, isLoading, error, myVote } = useVote(roomId ?? 0);

  useEffect(() => {
    if (myVote || localStorage.getItem('myVote')) {
      navigate('/progress', { replace: true });
    }
  }, [myVote, navigate]);

  useEffect(() => {
    voteApi.getVoteTypes().then((res) => setVoteTypes(res.result)).catch(() => {});
  }, []);

  const handleVote = async () => {
    if (!selected || !roomId) return;
    const voteType = voteTypes.find((t) => String(t.voteTypeId) === selected);
    if (!voteType) return;
    try {
      await submitVote(voteType.label);
      navigate('/progress');
    } catch {
      // error는 useVote 내부에서 관리
    }
  };

  if (!roomId) {
    return (
      <main className="flex flex-col flex-1 items-center justify-center gap-4">
        <p className="text-base font-medium text-gray-700">방 정보를 불러올 수 없습니다.</p>
        <p className="text-sm text-gray-400">QR 코드를 다시 스캔해주세요.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 justify-between">
      <section className="flex flex-col items-center gap-5">
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          찬반 투표
        </div>

        <header className="flex flex-col items-center gap-1">
          <p className="text-lg font-bold text-gray-900 text-center">{question}</p>
        </header>

        <img
          src={getCreamImage(selected, voteTypes)}
          alt="크림 캐릭터"
          className="w-48 h-48 object-contain"
        />

        <ul className="flex flex-col gap-3 w-full list-none p-0">
          {voteTypes.map((type) => {
            const id = String(type.voteTypeId);
            const isSelected = selected === id;
            const isHot = type.label === '더워요';

            return (
              <li key={type.voteTypeId}>
                <button
                  onClick={() => setSelected(id)}
                  className={[
                    'w-full py-8 px-5 rounded-2xl text-center transition-all cursor-pointer',
                    isSelected && isHot
                      ? 'bg-red-50 text-red-600 ring-2 ring-red-300'
                      : isSelected
                      ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-400'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
                  ].join(' ')}
                >
                  <p className="text-lg font-bold">{type.label}!</p>
                  <p className={`text-sm mt-1 ${isSelected && isHot ? 'text-red-300' : isSelected ? 'text-blue-400' : 'text-gray-400'}`}>
                    {DESCRIPTIONS[type.label] ?? ''}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>

        {error && (
          <p role="alert" className="text-xs text-gray-400">{error}</p>
        )}
      </section>

      <p className="flex items-center gap-1 text-xs text-gray-400 mt-2">
        <span>ⓘ</span>
        <span>한 번 투표하면 변경할 수 없어요</span>
      </p>

      <button
        onClick={handleVote}
        disabled={!selected || isLoading || voteTypes.length === 0}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition"
      >
        {isLoading ? '투표 중...' : '투표하기'}
      </button>
    </main>
  );
}
