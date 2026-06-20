import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col flex-1 items-center justify-center gap-6">
      <div className="flex justify-center">
        <div className="bg-red-100 text-red-500 text-sm font-semibold px-5 py-2 rounded-full">
          오류
        </div>
      </div>

      <div className="w-28 h-28 bg-gray-200 rounded-xl" aria-hidden="true" />

      <section className="flex flex-col items-center gap-2 text-center">
        <p className="text-xl font-bold text-gray-900">페이지를 찾을 수 없어요</p>
        <p className="text-sm text-gray-400">
          잘못된 주소거나 더 이상 존재하지 않는 페이지입니다.
        </p>
      </section>

      <div className="w-full flex flex-col gap-3 mt-4">
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold cursor-pointer hover:bg-blue-400 transition-colors"
        >
          이전 페이지로
        </button>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl text-base font-semibold cursor-pointer hover:bg-gray-200 transition-colors"
        >
          처음으로
        </button>
      </div>
    </main>
  );
}
