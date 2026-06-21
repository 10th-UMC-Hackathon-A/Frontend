import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app-shell overflow-hidden bg-gray-100 flex justify-center">
      <div className="app-content w-full max-w-[430px] min-h-0 overflow-hidden bg-white flex flex-col px-5">
        <Outlet />
      </div>
    </div>
  );
}

