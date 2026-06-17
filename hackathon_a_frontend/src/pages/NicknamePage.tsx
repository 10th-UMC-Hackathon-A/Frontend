import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NicknamePage() {
  const [nickname, setNickname] = useState('')
  const navigate = useNavigate()
  const MAX_LENGTH = 8

  const handleEnter = () => {
    if (!nickname.trim() || nickname.length < 2) return
    navigate('/vote')
  }

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-col items-center gap-6 mt-12">
        <div className="w-24 h-24 rounded-full bg-gray-200" />
        <div className="w-full flex flex-col gap-2">
          <p className="text-base font-medium text-gray-800 text-center">닉네임을 입력해주세요</p>
          <p className="text-sm text-gray-400 text-center">다른 참여자와 닉네임이 겹치지 않게 입력해주세요</p>
          <div className="relative mt-2">
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-600 pr-14"
              placeholder="닉네임 입력"
              value={nickname}
              maxLength={MAX_LENGTH}
              onChange={(e) => setNickname(e.target.value)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {nickname.length}/{MAX_LENGTH}
            </span>
          </div>
          <p className="text-xs text-gray-400 text-center">2~8자 / 한글·영문만 입력 가능</p>
        </div>
      </div>
      <button
        onClick={handleEnter}
        disabled={nickname.trim().length < 2}
        className="w-full bg-gray-800 text-white py-4 rounded-xl text-sm font-medium disabled:bg-gray-200 disabled:text-gray-400"
      >
        입장하기
      </button>
    </div>
  )
}
