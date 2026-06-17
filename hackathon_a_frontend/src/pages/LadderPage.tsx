import React, { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { LadderCanvas } from '../components/ladder/LadderCanvas';
import { Button } from '../components/common/Button';

export const LadderPage: React.FC = () => {
  const [showResult, setShowResult] = useState(false);

  const handleStart = () => {
    setShowResult(true);
  };

  return (
    <Layout>
      <div className="ladder-page">
        <h1>사다리 타기</h1>
        <LadderCanvas
          participants={['참가자 1', '참가자 2', '참가자 3', '참가자 4']}
          destinations={['벌칙 1', '벌칙 2', '벌칙 3', '벌칙 4']}
          showResult={showResult}
        />
        <Button onClick={handleStart} disabled={showResult}>
          시작하기
        </Button>
      </div>
    </Layout>
  );
};
