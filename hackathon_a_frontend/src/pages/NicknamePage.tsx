import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/Logo.png';
import iconCheck from '../assets/images/Icon/Check.png';
import iconError from '../assets/images/Icon/Error.png';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { roomApi } from '../api/roomApi';
import { useRoomStore } from '../store/roomStore';
import { useUserStore } from '../store/userStore';
import { useGameStore } from '../store/gameStore';
import { useVoteStore } from '../store/voteStore';

const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{2,8}$/;

export default function NicknamePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { setRoomId, setRoomName } = useRoomStore();
  const { setNickname: saveNickname, setTokens } = useUserStore();
  const { reset: resetGame } = useGameStore();
  const { reset: resetVote } = useVoteStore();

  const roomIdParam = searchParams.get('roomId');
  const isDummyMode = import.meta.env.VITE_USE_DUMMY_API === 'true';
  let roomId: number | null;
  if (roomIdParam) {
    roomId = Number(roomIdParam);
  } else if (isDummyMode) {
    roomId = 1;
  } else {
    roomId = null;
  }

  const [nickname, setNickname] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // accessToken 있을 때만 재입장 확인 → 없으면 바로 폼
  const [isChecking, setIsChecking] = useState(
    roomId !== null && !!localStorage.getItem('accessToken')
  );
  const [error, setError] = useState<string | null>(null);
  const [fetchedRoomName, setFetchedRoomName] = useState<string | null>(null);

  const MAX_LENGTH = 8;

  useEffect(() => {
    if (!roomId) return;

    resetGame();

    roomApi
      .getRooms()
      .then((res) => {
        const found = res.result.find((r) => r.roomId === roomId);
        if (found) {
          setFetchedRoomName(found.roomName);
          setRoomName(found.roomName);
        }
      })
      .catch(() => {});

    const goToVoteWith = (nickName: string, token: string, refresh = '') => {
      localStorage.setItem('accessToken', token);
      if (refresh) localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('roomId', String(roomId));
      localStorage.removeItem('myVote');
      resetVote();
      setTokens(token, refresh);
      setRoomId(roomId!);
      saveNickname(nickName);
      navigate('/vote', { replace: true });
    };

    // uid로 /participants 재호출 → 기존 참가자면 닉네임+신규토큰 반환
    const tryJoinWithUid = () => {
      const uid = localStorage.getItem('uid');
      if (!uid) {
        setIsChecking(false);
        return;
      }

      roomApi
        .joinParticipant('재입장', roomId!)
        .then((res) =>
          goToVoteWith(res.result.nickName, res.result.accessToken, res.result.refreshToken)
        )
        .catch(() => {
          setIsChecking(false);
        });
    };

    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      // accessToken으로 방 참가 여부 확인 (닉네임 조회)
      roomApi
        .verifyAccess(roomId)
        .then((res) =>
          goToVoteWith(res.result.nickName, accessToken, localStorage.getItem('refreshToken') ?? '')
        )
        .catch(() => {
          // 접근 불가 → 이전에 등록된 uid로 새 토큰 재발급 시도
          localStorage.removeItem('accessToken');
          tryJoinWithUid();
        });
    }
    // accessToken 없으면 isChecking 초기값이 이미 false → 폼 바로 표시
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
      const refreshToken = result.result.refreshToken;

      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('roomId', String(roomId));
      localStorage.removeItem('myVote');
      resetVote();

      setTokens(accessToken, refreshToken ?? '');
      setRoomId(roomId);
      saveNickname(nickname.trim());

      navigate('/vote');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const code = err.response?.data?.code as string | undefined;
        const status = err.response?.status;
        // 서버 무응답(타임아웃/네트워크/CORS) → response 자체가 없음
        if (!err.response) {
          setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
        } else if (status === 409 || code?.includes('DUPLICATE') || code?.includes('EXIST')) {
          setError('이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.');
        } else if (status === 404) {
          setError('방을 찾을 수 없습니다. QR 코드를 다시 확인해주세요.');
        } else if (status === 410) {
          // 라운드 전환됨(ROOM412) → 방 정보 재조회 후 join 1회 재시도
          localStorage.setItem('roomId', String(roomId));
          setRoomId(roomId);
          try {
            await roomApi.getRoomDetails(roomId); // 방 정보 재조회
            const retry = await roomApi.joinParticipant(nickname.trim(), roomId);
            const at = retry.result.accessToken;
            const rt = retry.result.refreshToken;
            localStorage.setItem('accessToken', at);
            if (rt) localStorage.setItem('refreshToken', rt);
            localStorage.removeItem('myVote');
            resetVote();
            setTokens(at, rt ?? '');
            saveNickname(nickname.trim());
            navigate('/vote', { replace: true });
            return;
          } catch {
            // 재시도도 실패 → 투표창 상태로 분기
            try {
              const detail = await roomApi.getRoomDetails(roomId);
              const closedAt = detail.result.voteClosedAt
                ? new Date(detail.result.voteClosedAt).getTime()
                : null;
              if (closedAt !== null && closedAt < Date.now()) {
                navigate('/result', { replace: true }); // 투표 종료
              } else {
                navigate('/progress', { replace: true }); // 투표 진행 중
              }
            } catch {
              navigate('/progress', { replace: true });
            }
            return;
          }
        } else {
          const msg = err.response?.data?.message ?? '알 수 없는 오류';
          setError(`입장에 실패했습니다. (${status} · ${code ?? msg})`);
        }
      } else {
        setError(`입장에 실패했습니다. (${err instanceof Error ? err.message : '네트워크 오류'})`);
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

  if (isChecking) {
    return (
      <main className="flex flex-col flex-1 items-center justify-center gap-3">
        <p className="text-sm text-gray-400">입장 정보 확인 중...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 min-h-0 justify-between gap-2">
      <section className="flex flex-col items-center gap-[clamp(10px,2.5vh,24px)] mt-[clamp(4px,2vh,24px)] min-h-0">
        <div className="w-full bg-blue-50 rounded-2xl px-5 py-4 flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">진행 중인 방</span>
          <p className="text-lg font-bold text-gray-900">{fetchedRoomName ?? `방 #${roomId}`}</p>
        </div>

        <img
          src={logo}
          alt="냉방전쟁 로고"
          className="w-auto max-w-[260px] max-h-[clamp(150px,28vh,260px)] object-contain"
        />

        <div className="w-full flex flex-col items-center gap-1">
          <p className="text-xl font-bold text-gray-900">닉네임을 입력해 주세요</p>
          <p className="text-sm text-gray-400">다른 참여자에게 보여지는 이름이에요</p>
        </div>

        <div className="w-full flex flex-col gap-1">
          <div className="relative">
            <input
              className="w-full bg-gray-100 rounded-xl px-4 py-3.5 pr-12 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition"
              placeholder="닉네임 입력"
              value={nickname}
              maxLength={MAX_LENGTH}
              onChange={(e) => {
                setNickname(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
            />
            {nickname.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <img
                  src={isNicknameValid && !error ? iconCheck : iconError}
                  alt={isNicknameValid && !error ? '유효' : '오류'}
                  className="w-7 h-7 object-contain"
                />
              </span>
            )}
          </div>

          {nickname.length > 0 && !isNicknameValid && !error && (
            <p role="alert" className="text-xs text-red-400 px-1">
              닉네임 생성조건을 확인해주세요
            </p>
          )}
          {nickname.length > 0 && isNicknameValid && !error && (
            <p className="text-xs text-green-500 px-1">생성 가능한 닉네임입니다</p>
          )}
          {error && (
            <p role="alert" className="text-xs text-red-400 px-1">
              {error.includes('중복') || error.includes('사용 중') ? '중복된 닉네임입니다' : error}
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
            <Link
              to="/terms"
              className="underline text-blue-500"
              onClick={(e) => e.stopPropagation()}
            >
              이용 약관 및 개인 정보 처리 방침
            </Link>
            에 동의합니다.
          </span>
        </label>
      </section>

      <button
        onClick={handleEnter}
        disabled={!isValid || isLoading}
        className="w-full bg-blue-500 text-white py-3 rounded-2xl text-base font-semibold disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-blue-400 active:bg-blue-600 transition shrink-0"
      >
        {isLoading ? '입장 중...' : '입장하기'}
      </button>
    </main>
  );
}
