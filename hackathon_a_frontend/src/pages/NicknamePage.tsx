import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/Logo.png';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { roomApi } from '../api/roomApi';
import { useRoomStore } from '../store/roomStore';
import { useUserStore } from '../store/userStore';
import { useGameStore } from '../store/gameStore';

const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{2,8}$/;

export default function NicknamePage() {
  const [nickname, setNickname] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedRoomName, setFetchedRoomName] = useState<string | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { setRoomId, setRoomName } = useRoomStore();
  const { setNickname: saveNickname, setTokens } = useUserStore();
  const { reset: resetGame } = useGameStore();

  const roomIdParam = searchParams.get('roomId');
  // const roomId = roomIdParam ? Number(roomIdParam) : null; > 최종 roomId적용 할 때 주석 해제

  // 테스트용 더미
  const isDummyMode = import.meta.env.VITE_USE_DUMMY_API === 'true';
  let roomId: number | null;
  if (roomIdParam) {
    roomId = Number(roomIdParam);
  } else if (isDummyMode) {
    roomId = 1;
  } else {
    roomId = null;
  }

  const MAX_LENGTH = 8;

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/vote', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!roomId) return;
    resetGame();
    roomApi.getRooms().then((res) => {
      const found = res.result.find((r) => r.roomId === roomId);
      if (found) {
        setFetchedRoomName(found.roomName);
        setRoomName(found.roomName);
      }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isNicknameValid = NICKNAME_REGEX.test(nickname.trim());
  const isValid = isNicknameValid && agreed;

  const handleEnter = async () => {
    if (!isValid || !roomId || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await roomApi.joinParticipant(nickname.trim(), roomId);
      const accessToken = result.result.accessToken;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('roomId', String(roomId));
      localStorage.removeItem('myVote');

      setTokens(accessToken, '');
      setRoomId(roomId);
      saveNickname(nickname.trim());

      navigate('/vote');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const code = err.response?.data?.code as string | undefined;
        const status = err.response?.status;
        if (status === 409 || code?.includes('DUPLICATE') || code?.includes('EXIST')) {
          setError('이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.');
        } else if (status === 404) {
          setError('방을 찾을 수 없습니다. QR 코드를 다시 확인해주세요.');
        } else {
          setError('입장에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        setError('입장에 실패했습니다. 다시 시도해주세요.');
      }
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
      <section className="flex flex-col items-center gap-6 mt-6">
        <div className="w-full flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">진행 중인 방</span>
          <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
            {fetchedRoomName ?? `방 #${roomId}`}
          </div>
        </div>

        <img src={logo} alt="냉방전쟁 로고" style={{ width: '400px' }} className="object-contain" />

        <div className="w-full flex flex-col items-center gap-1">
          <p className="text-xl font-bold text-gray-900">닉네임을 입력해 주세요</p>
          <p className="text-sm text-gray-400">다른 참여자에게 보여지는 이름이에요</p>
        </div>

        <div className="w-full flex flex-col gap-1">
          <div className="relative">
            <input
              className="w-full bg-gray-100 rounded-xl px-4 py-3.5 pr-14 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition"
              placeholder="닉네임 입력"
              value={nickname}
              maxLength={MAX_LENGTH}
              onChange={(e) => {
                setNickname(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {nickname.length}/{MAX_LENGTH}
            </span>
          </div>

          <p className="text-xs text-gray-400 px-1">2~8자의 한글, 영문 또는 숫자</p>

          {nickname.length > 0 && !isNicknameValid && (
            <p role="alert" className="text-xs text-red-400 px-1">
              2~8자 한글·영문·숫자만 입력 가능합니다
            </p>
          )}

          {error && (
            <p role="alert" className="text-xs text-red-400 px-1">
              {error}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 cursor-pointer w-full">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 accent-blue-500"
          />
          <span className="text-sm text-gray-500">
            <Link to="/terms" className="underline text-blue-500" onClick={(e) => e.stopPropagation()}>
              이용 약관 및 개인정보 처리 방침
            </Link>에 동의합니다.
          </span>
        </label>
      </section>

      <button
        onClick={handleEnter}
        disabled={!isValid || isLoading}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-blue-400 active:bg-blue-600 transition"
      >
        {isLoading ? '입장 중...' : '입장하기'}
      </button>
    </main>
  );
}
