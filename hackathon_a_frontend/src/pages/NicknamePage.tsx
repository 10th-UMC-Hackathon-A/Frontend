import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NicknamePage() {
  const [nickname, setNickname] = useState('')
  const [agreed, setAgreed] = useState(false)
  const navigate = useNavigate()
  const MAX_LENGTH = 8

  const isValid = nickname.trim().length >= 2 && agreed

  const handleEnter = () => {
    if (!isValid) return
    navigate('/vote')
  }

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-col items-center gap-6 mt-6">
        {/* 방 정보 뱃지 */}
        <div className="w-full flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">진행 중인 방</span>
          <div className="bg-blue-100 text-blue-500 text-sm font-semibold px-5 py-2 rounded-full">
            가천대학교 502호 강의실
          </div>
        </div>

        {/* 아바타 */}
        <div className="w-28 h-28 rounded-full bg-gray-200" />

        {/* 안내 텍스트 */}
        <div className="w-full flex flex-col items-center gap-1">
          <p className="text-xl font-bold text-gray-900">닉네임을 입력해 주세요</p>
          <p className="text-sm text-gray-400">다른 참여자에게 보여지는 이름이에요</p>
        </div>

        {/* 입력 필드 */}
        <div className="w-full flex flex-col gap-1">
          <input
            className="w-full bg-gray-100 rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition"
            placeholder="닉네임 입력"
            value={nickname}
            maxLength={MAX_LENGTH}
            onChange={(e) => setNickname(e.target.value)}
          />
          <p className="text-xs text-gray-400 px-1">2~8자의 한글, 영문 또는 숫자</p>
        </div>

        {/* 약관 동의 */}
        <label className="flex items-center gap-2 cursor-pointer w-full">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 accent-blue-500"
          />
          <span className="text-sm text-gray-500">
            이용 약관 및 개인 정보 처리 방침에 동의합니다.
          </span>
        </label>
      </div>

      {/* 입장 버튼 */}
      <button
        onClick={handleEnter}
        disabled={!isValid}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition"
      >
        입장하기
      </button>
    </div>
  )
}
