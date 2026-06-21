import { useNavigate } from 'react-router-dom';
import creamError from '../assets/images/Character/Error.png';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col flex-1 gap-8 pt-[clamp(80px,18vh,180px)]">
      {/* 에러 카드 */}
      <section className="mx-2 bg-red-50 rounded-2xl px-6 py-9 flex flex-col items-center gap-5">
        <div className="relative w-full h-24">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-3xl font-medium leading-none">!</span>
          </div>
          <img
            src={creamError}
            alt="에러 캐릭터"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-24 object-contain"
          />
        </div>

        <h1 className="text-2xl font-black text-red-500 text-center mt-1">방을 찾을 수 없어요</h1>

        <ul className="flex flex-col gap-1 text-base font-medium text-gray-600 list-disc pl-5 self-start mx-auto">
          <li>QR 코드가 잘못되었거나</li>
          <li>방이 종료 되었거나</li>
          <li>URL이 만료 되었을 수 있습니다</li>
        </ul>

        <p className="text-xs text-gray-400 self-start mt-7">오류 코드: ROOM_NOT_FOUND</p>
      </section>

      <p className="text-xs text-gray-400 px-2">문제가 계속되면 운영자에게 문의하세요</p>

      <button
        onClick={() => navigate('/', { replace: true })}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold cursor-pointer hover:bg-blue-400 transition-colors mt-auto"
      >
        처음으로 돌아가기
      </button>
    </main>
  );
}
