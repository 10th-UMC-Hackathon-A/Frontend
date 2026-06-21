import axios, { type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://52.78.104.214';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 → refreshToken으로 재발급 후 원요청 1회 재시도, 실패 시 로그아웃
function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/';
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;

    const isRefreshCall = original?.url?.includes('/auth/token/refresh');

    if (status === 401 && original && !original._retry && !isRefreshCall) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // 인터셉터 재귀 방지를 위해 별도 axios 인스턴스 사용
          const res = await axios.post(`${BASE_URL}/auth/token/refresh`, { refreshToken });
          const newAccess = res.data?.result?.accessToken as string | undefined;
          const newRefresh = res.data?.result?.refreshToken as string | undefined;

          if (newAccess) {
            localStorage.setItem('accessToken', newAccess);
            if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
            original.headers.Authorization = `Bearer ${newAccess}`;
            return axiosInstance(original); // 원요청 재시도
          }
        } catch {
          // 재발급 실패 → 아래에서 로그아웃
        }
      }

      logout();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
