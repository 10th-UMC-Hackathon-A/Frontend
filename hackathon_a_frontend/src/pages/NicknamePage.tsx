import React, { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const NicknamePage: React.FC = () => {
  const [nickname, setNickname] = useState('');

  const handleSubmit = () => {
    // TODO: Implement nickname submission
    console.log('Nickname:', nickname);
  };

  return (
    <Layout>
      <div className="nickname-page">
        <h1>닉네임을 입력하세요</h1>
        <Input
          value={nickname}
          onChange={setNickname}
          placeholder="닉네임 입력"
        />
        <Button onClick={handleSubmit} disabled={!nickname.trim()}>
          확인
        </Button>
      </div>
    </Layout>
  );
};
