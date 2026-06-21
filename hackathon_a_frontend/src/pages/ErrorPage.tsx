import { useNavigate } from 'react-router-dom';
import creamError from '../assets/해커톤 team+/Character/Error.png';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col flex-1 justify-center gap-6">
      {/* 에러 카드 */}
      <section className="bg-red-50 rounded-2xl px-6 py-8 flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-black leading-none">!</span>
          </div>
          <img src={creamError} alt="에러 캐릭터" className="w-14 h-14 object-contain" />
        </div>

        <h1 className="text-2xl font-black text-red-500 text-center">방을 찾을 수 없어요</h1>

        <ul className="flex flex-col gap-1 text-sm text-gray-600 list-disc pl-5 self-start">
          <li>QR 코드가 잘못되었거나</li>
          <li>방이 종료 되었거나</li>
          <li>URL이 만료 되었을 수 있습니다</li>
        </ul>

        <p className="text-xs text-gray-400 self-start mt-2">오류 코드: ROOM_NOT_FOUND</p>
      </section>

      <p className="text-xs text-gray-400 text-center">문제가 계속되면 운영자에게 문의하세요</p>

      <button
        onClick={() => navigate('/', { replace: true })}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold cursor-pointer hover:bg-blue-400 transition-colors mt-auto"
      >
        처음으로 돌아가기
      </button>
    </main>
  );
}
