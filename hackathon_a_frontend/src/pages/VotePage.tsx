import { useState, useEffect } from 'react';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useVote } from '../hooks/useVote';
import { useRoomStore } from '../store/roomStore';
import { voteApi } from '../api/voteApi';
import type { VoteTypeResDto } from '../types/vote';
import creamDefault from '../assets/images/Icon/Cream/Default.png';
import creamCold from '../assets/images/Icon/Cream/Cold.png';
import creamHot from '../assets/images/Icon/Cream/Hot.png';
import voteColdDefault from '../assets/images/Vote/Cold/Default.png';
import voteColdSelected from '../assets/images/Vote/Cold/Selected.png';
import voteHotDefault from '../assets/images/Vote/Hot/Default.png';
import voteHotSelected from '../assets/images/Vote/Hot/Selected.png';

const question = 'Q. 지금 강의실 온도는 어때요?';

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

  // 진입 시 분기:
  // - 이미 투표한 사람 → 진행 화면
  // - 처음 들어온(미투표) 사람 → 투표 화면(추워요/더워요)을 그대로 보여준다.
  //   (투표가 실제로 마감됐는지는 제출 시 서버 응답으로 판단해 결과 화면으로 이동)
  useEffect(() => {
    if (myVote || localStorage.getItem('myVote')) {
      navigate('/progress', { replace: true });
    }
  }, [myVote, navigate]);

  useEffect(() => {
    voteApi
      .getVoteTypes()
      .then((res) => setVoteTypes(res.result))
      .catch(() => {});
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
    <main className="flex flex-col flex-1 min-h-0 justify-between gap-2">
      <section className="flex flex-col items-center gap-[clamp(6px,1.5svh,20px)] min-h-0">
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          찬반 투표
        </div>

        <header className="flex flex-col items-center gap-1">
          <p className="text-lg font-bold text-gray-900 text-center">{question}</p>
        </header>

        <img
          src={getCreamImage(selected, voteTypes)}
          alt="크림 캐릭터"
          className="w-[clamp(130px,24svh,220px)] h-auto aspect-square object-contain"
        />

        <ul className="flex flex-col gap-2 w-[clamp(230px,37svh,310px)] max-w-full list-none p-0">
          {voteTypes.map((type) => {
            const id = String(type.voteTypeId);
            const isSelected = selected === id;
            const isHot = type.label === '더워요';
            const imgSrc = isHot
              ? isSelected
                ? voteHotSelected
                : voteHotDefault
              : isSelected
                ? voteColdSelected
                : voteColdDefault;

            return (
              <li key={type.voteTypeId}>
                <button
                  onClick={() => setSelected(id)}
                  className="w-full cursor-pointer transition-transform active:scale-95"
                >
                  <img src={imgSrc} alt={type.label} className="w-full object-contain" />
                </button>
              </li>
            );
          })}
        </ul>

        {error && (
          <p role="alert" className="text-xs text-gray-400">
            {error}
          </p>
        )}
      </section>

      <div className="flex flex-col items-center gap-2 shrink-0">
        <p className="text-xs text-gray-400">ⓘ 한 번 투표하면 변경할 수 없어요</p>
        <Button variant="blue" fullWidth disabled={!selected || isLoading || voteTypes.length === 0} onClick={handleVote}>
          {isLoading ? '투표 중...' : '투표하기'}
        </Button>
      </div>
    </main>
  );
}
