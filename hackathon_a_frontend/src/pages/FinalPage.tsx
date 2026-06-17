import { PunishmentCard } from '../components/final/PunishmentCard';
import { Button } from '../components/common/Button';

export default function FinalPage() {
  const handleRestart = () => {
    // TODO: Implement restart logic
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">최종 결과</h1>
      <PunishmentCard
        nickname="참가자 이름"
        punishment="벌칙 내용"
      />
      <Button onClick={handleRestart} fullWidth>
        다시 시작하기
      </Button>
    </div>
  );
}
