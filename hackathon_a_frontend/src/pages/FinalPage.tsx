import React from 'react';
import { Layout } from '../components/common/Layout';
import { PunishmentCard } from '../components/final/PunishmentCard';
import { Button } from '../components/common/Button';

export const FinalPage: React.FC = () => {
  const handleRestart = () => {
    // TODO: Implement restart logic
  };

  return (
    <Layout>
      <div className="final-page">
        <h1>최종 결과</h1>
        <PunishmentCard
          nickname="참가자 이름"
          punishment="벌칙 내용"
        />
        <Button onClick={handleRestart}>
          다시 시작하기
        </Button>
      </div>
    </Layout>
  );
};
