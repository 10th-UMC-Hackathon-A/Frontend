import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Navbar />
      <main className="w-full max-w-[430px] flex-1 flex flex-col px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}