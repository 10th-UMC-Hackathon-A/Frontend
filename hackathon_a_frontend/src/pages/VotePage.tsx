import React, { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { VoteCard } from '../components/vote/VoteCard';
import { Button } from '../components/common/Button';

export const VotePage: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleVote = () => {
    // TODO: Implement vote submission
    console.log('Selected user:', selectedUserId);
  };

  return (
    <Layout>
      <div className="vote-page">
        <h1>벌칙 받을 사람을 투표하세요</h1>
        <div className="vote-cards">
          {/* TODO: Map actual users */}
        </div>
        <Button onClick={handleVote} disabled={!selectedUserId}>
          투표하기
        </Button>
      </div>
    </Layout>
  );
};
