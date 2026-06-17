import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ProgressBar } from '../components/common/ProgressBar';

export const ComponentDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10 max-w-md mx-auto">
      <h1 className="text-xl font-bold">공통 컴포넌트 데모</h1>

      {/* Button */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-500">Button — variant</h2>
        <Button variant="primary" fullWidth>primary (기본)</Button>
        <Button variant="secondary" fullWidth>secondary</Button>
        <Button variant="danger" fullWidth>danger</Button>
        <Button variant="ghost" fullWidth>ghost</Button>
        <Button variant="primary" disabled fullWidth>disabled</Button>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-500">Button — size</h2>
        <div className="flex gap-2 items-center">
          <Button size="sm">sm</Button>
          <Button size="md">md</Button>
          <Button size="lg">lg</Button>
        </div>
      </section>

      {/* Input */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-500">Input</h2>
        <Input
          value={inputValue}
          onChange={setInputValue}
          placeholder="닉네임 입력"
          maxLength={8}
          showCount
        />
        <Input value="" onChange={() => {}} placeholder="disabled 상태" disabled />
      </section>

      {/* ProgressBar */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-500">ProgressBar</h2>
        <ProgressBar value={62} label="추워요!" />
        <ProgressBar value={38} label="더워요!" />
        <ProgressBar value={50} />
        <ProgressBar value={100} label="완료" />
        <ProgressBar value={0} label="0%" />
      </section>
    </div>
  );
};
