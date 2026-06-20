import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col flex-1 gap-5">
      <div className="flex justify-center">
        <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
          이용 약관
        </div>
      </div>

      <section className="flex flex-col gap-6 flex-1 overflow-y-auto text-sm text-gray-600 leading-relaxed">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">이용 약관</h2>
          <p>
            본 서비스는 강의실 내 실시간 투표 및 벌칙 추첨을 위한 참여형 앱입니다.
            서비스 이용 시 아래 사항에 동의하는 것으로 간주됩니다.
          </p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>닉네임은 다른 참여자에게 공개됩니다.</li>
            <li>투표 결과 및 벌칙 추첨 결과는 전체 참여자에게 공개됩니다.</li>
            <li>서비스 내 생성된 데이터는 세션 종료 후 삭제될 수 있습니다.</li>
            <li>악의적인 사용(닉네임 도용, 시스템 남용 등)은 제한될 수 있습니다.</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-gray-900">개인정보 처리 방침</h2>
          <p>
            본 서비스는 서비스 운영에 필요한 최소한의 정보만 수집합니다.
          </p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>수집 항목: 닉네임, 투표 내용</li>
            <li>수집 목적: 실시간 투표 및 결과 집계</li>
            <li>보관 기간: 세션 종료 시까지</li>
            <li>제3자 제공: 없음</li>
          </ul>
          <p className="text-xs text-gray-400 mt-1">
            개인정보와 관련된 문의는 운영팀에 문의해주세요.
          </p>
        </div>
      </section>

      <button
        onClick={() => navigate(-1)}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold cursor-pointer hover:bg-blue-400 transition-colors"
      >
        확인했습니다
      </button>
    </main>
  );
}
