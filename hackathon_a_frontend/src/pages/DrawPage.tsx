import { useNavigate } from 'react-router-dom';
import { useVoteStore } from '../store/voteStore';

export default function DrawPage() {
  const navigate = useNavigate();
  const { voteResults } = useVoteStore();

  const handleReVote = () => {
    localStorage.removeItem('myVote');
    navigate('/vote', { replace: true });
  };

  return (
    <main className="flex flex-col flex-1 gap-6">
      <div className="flex justify-center">
        <div className="bg-yellow-100 text-yellow-600 text-sm font-semibold px-5 py-2 rounded-full">
          동률
        </div>
      </div>

      <section className="flex flex-col items-center gap-2 mt-2">
        <p className="text-2xl font-black text-gray-900">동률입니다!</p>
        <p className="text-sm text-gray-400 text-center">득표 수가 같아 다시 투표합니다</p>
      </section>

      <div className="flex justify-center">
        <div className="w-28 h-28 bg-gray-200 rounded-xl" aria-hidden="true" />
      </div>

      {voteResults.length > 0 && (
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-700">동률 결과</p>
          {voteResults.map((r, idx) => (
            <div
              key={r.label}
              className="flex justify-between items-center bg-gray-100 rounded-xl px-4 py-3"
            >
              <span className="text-sm font-semibold text-gray-700">{r.label}</span>
              <span
                className={`text-sm font-bold ${idx === 0 ? 'text-blue-500' : 'text-red-400'}`}
              >
                {r.count}표
              </span>
            </div>
          ))}
        </section>
      )}

      <button
        onClick={handleReVote}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold mt-auto cursor-pointer hover:bg-blue-400 transition-colors"
      >
        다시 투표하기
      </button>
    </main>
  );
}
