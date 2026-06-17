import { useState } from 'react';
import { LadderCanvas } from '../components/ladder/LadderCanvas';
import { Button } from '../components/common/Button';

export default function LadderPage() {
  const [showResult, setShowResult] = useState(false);

  const handleStart = () => {
    setShowResult(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">사다리 타기</h1>
      <LadderCanvas
        participants={['참가자 1', '참가자 2', '참가자 3', '참가자 4']}
        destinations={['벌칙 1', '벌칙 2', '벌칙 3', '벌칙 4']}
        showResult={showResult}
      />
      <Button onClick={handleStart} disabled={showResult} fullWidth>
        시작하기
      </Button>
    </div>
  );
}
