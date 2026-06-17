import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NicknamePage() {
  const [nickname, setNickname] = useState('')
  const navigate = useNavigate()

  const handleEnter = () => {
    if (!nickname.trim()) return
    // 나중에 roomStore에 저장
    navigate('/vote')
  }

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-col items-center gap-6 mt-12">
        <div className="w-24 h-24 rounded-full bg-gray-200" />
        <div className="w-full flex flex-col gap-2">
          <p className="text-base font-medium text-gray-800 text-center">닉네임을 입력해주세요</p>
          <p className="text-sm text-gray-400 text-center">다른 참여자와 닉네임이 겹치지 않게 입력해주세요</p>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-500 mt-2"
            placeholder="닉네임 입력"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <p className="text-xs text-gray-400 text-center">2~8자 / 한글·영문만 입력 가능</p>
        </div>
      </div>
      <button
        onClick={handleEnter}
        className="w-full bg-gray-800 text-white py-4 rounded-xl text-sm font-medium"
      >
        입장하기
      </button>
    </div>
  )
}