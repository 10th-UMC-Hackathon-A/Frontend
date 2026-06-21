import { Navigate, Outlet } from 'react-router-dom';

/**
 * accessToken이 없으면(=정상 입장하지 않은 상태) 인증이 필요한 게임 화면 진입을 막고
 * 닉네임 화면으로 돌려보낸다. 토큰 없이 vote/mission-complete 등을 호출해
 * COMMON408(필수 헤더 누락)이 터지는 상황을 원천 차단한다.
 */
export default function RequireAuth() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    const roomId = localStorage.getItem('roomId');
    // roomId를 유지해 닉네임 화면에서 같은 방으로 재입장할 수 있게 한다.
    const to = roomId ? `/?roomId=${roomId}` : '/';
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}
