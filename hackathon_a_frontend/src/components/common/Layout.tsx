import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-white flex flex-col px-5 py-6">
        <Outlet />
      </div>
    </div>
  );
}
