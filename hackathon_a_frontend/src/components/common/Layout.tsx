import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="h-dvh overflow-hidden bg-gray-100 flex justify-center">
      <div className="w-full max-w-[430px] h-dvh min-h-0 overflow-hidden bg-white flex flex-col px-5 py-[clamp(16px,2.5vh,24px)]">
        <Outlet />
      </div>
    </div>
  );
}

