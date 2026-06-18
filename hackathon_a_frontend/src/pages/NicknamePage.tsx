import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { roomApi } from '../api/roomApi';
import { useRoomStore } from '../store/roomStore';
import { useUserStore } from '../store/userStore';

const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{2,8}$/;

export default function NicknamePage() {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { setRoomId } = useRoomStore();
  const { setNickname: saveNickname, setTokens } = useUserStore();

  const roomIdParam = searchParams.get('roomId');
  const roomId = roomIdParam ? Number(roomIdParam) : null;

  useEffect(() => {
    // 이미 토큰이 있으면 투표 페이지로 이동 (F1.3 중복 진입 처리)
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/vote', { replace: true });
    }
  }, [navigate]);

  const isValid = NICKNAME_REGEX.test(nickname);

  const handleEnter = async () => {
    if (!isValid || !roomId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await roomApi.joinParticipant(nickname, roomId);
      const { accessToken, refreshToken } = result.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setTokens(accessToken, refreshToken);
      setRoomId(roomId);
      saveNickname(nickname);

      navigate('/vote');
    } catch {
      setError('입장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!roomId) {
    return (
      <main className="flex flex-col flex-1 items-center justify-center gap-4">
        <p className="text-base font-medium text-gray-700">유효하지 않은 방입니다.</p>
        <p className="text-sm text-gray-400">QR 코드를 다시 스캔해주세요.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 justify-between">
      <section className="flex flex-col items-center gap-6 mt-12">
        <div className="w-24 h-24 rounded-full bg-gray-200" aria-hidden="true" />
        <div className="w-full flex flex-col gap-2">
          <p className="text-base font-medium text-gray-800 text-center">닉네임을 입력해주세요</p>
          <p className="text-sm text-gray-400 text-center">2~8자 한글·영문·숫자만 입력 가능해요</p>
          <div className="relative mt-2">
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-600 pr-14 transition-colors"
              placeholder="닉네임 입력"
              value={nickname}
              maxLength={8}
              onChange={(e) => {
                setNickname(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {nickname.length}/8
            </span>
          </div>
          {nickname.length > 0 && !isValid && (
            <p role="alert" className="text-xs text-red-400">
              2~8자 한글·영문·숫자만 입력 가능합니다
            </p>
          )}
          {error && (
            <p role="alert" className="text-xs text-red-400 text-center">
              {error}
            </p>
          )}
        </div>
      </section>

      <button
        onClick={handleEnter}
        disabled={!isValid || isLoading}
        className="w-full bg-gray-800 text-white py-4 rounded-xl text-sm font-medium
          disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
          hover:bg-gray-700 active:bg-gray-900 cursor-pointer transition-colors"
      >
        {isLoading ? '입장 중...' : '입장하기'}
      </button>
    </main>
  );
}
