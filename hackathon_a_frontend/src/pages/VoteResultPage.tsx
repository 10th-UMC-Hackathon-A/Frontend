import React from 'react';
import { Layout } from '../components/common/Layout';
import { VoteResultBar } from '../components/vote/VoteResultBar';
import { Button } from '../components/common/Button';

export const VoteResultPage: React.FC = () => {
  const handleNext = () => {
    // TODO: Navigate to next page
  };

  return (
    <Layout>
      <div className="vote-result-page">
        <h1>투표 결과</h1>
        <div className="vote-results">
          {/* TODO: Map actual vote results */}
        </div>
        <Button onClick={handleNext}>
          다음 단계로
        </Button>
      </div>
    </Layout>
  );
};
