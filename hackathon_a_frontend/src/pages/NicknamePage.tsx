import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { roomApi } from '../api/roomApi';
import { useRoomStore } from '../store/roomStore';
import { useUserStore } from '../store/userStore';

const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{2,8}$/;

export default function NicknamePage() {
const [nickname, setNickname] = useState('');
const [agreed, setAgreed] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const navigate = useNavigate();
const [searchParams] = useSearchParams();

const { setRoomId } = useRoomStore();
const { setNickname: saveNickname, setTokens } = useUserStore();

const roomIdParam = searchParams.get('roomId');
const roomId = roomIdParam ? Number(roomIdParam) : null;

const MAX_LENGTH = 8;

useEffect(() => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    navigate('/vote', { replace: true });
  }
}, [navigate]);

const isNicknameValid = NICKNAME_REGEX.test(nickname.trim());
const isValid = isNicknameValid && agreed;

const handleEnter = async () => {
  if (!isValid || !roomId || isLoading) return;

  setIsLoading(true);
  setError(null);

  try {
    const result = await roomApi.joinParticipant(nickname.trim(), roomId);
    const { accessToken, refreshToken } = result.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    setTokens(accessToken, refreshToken);
    setRoomId(roomId);
    saveNickname(nickname.trim());

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
    <section className="flex flex-col items-center gap-6 mt-6">
      <div className="w-full flex flex-col items-center gap-1">
        <span className="text-xs text-gray-400">진행 중인 방</span>
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          가천대학교 502호 강의실
        </div>
      </div>

      <div className="w-28 h-28 rounded-full bg-gray-200" aria-hidden="true" />

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
          이용 약관 및 개인 정보 처리 방침에 동의합니다.
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
      >
        {isLoading ? '입장 중...' : '입장하기'}
      </button>
    </main>
  );
}
