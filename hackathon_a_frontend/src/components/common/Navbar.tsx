interface NavbarProps {
  roomName?: string
}

export default function Navbar({ roomName = '회의실 A' }: NavbarProps) {
  return (
    <header className="w-full max-w-[430px] mx-auto px-4 py-3 flex items-center border-b border-gray-200 bg-white">
      <span className="text-base font-medium text-gray-800">{roomName}</span>
    </header>
  )
}