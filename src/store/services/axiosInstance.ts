import axios from 'axios';
import Cookies from 'js-cookie';
import { store } from '../index';
import { clearUser } from '../slices/authSlice';
import { toast } from 'sonner';

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3008/api',
  withCredentials: true,
});

export const refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response = await axios.post<RefreshTokenResponse>(
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3008/api'}/auth/refresh-token`,
    { refreshToken }
  );
  return response.data;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const fullUrl = `${config.baseURL || ''}${config.url}`;
    console.log('Making request to:', fullUrl);
    console.log('Request method:', config.method);
    console.log('Request headers:', config.headers);
    console.log('Request body:', config.data);

    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log('error.response', error.response);
    console.log('error.response.status', error.response?.status);

    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      const blockedUserMessage = error.response.data?.message;

      if (blockedUserMessage === 'User is blocked') {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        store.dispatch(clearUser());

        console.log('User is blocked. Logging out automatically.');
        toast.error("User Temporarily Blocked");

        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
          try {
            const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);
            Cookies.set('accessToken', accessToken, { expires: 1 / 96 });
            Cookies.set('refreshToken', newRefreshToken, { expires: 7 });
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            console.log('Failed to refresh token. User needs to log in again.');

            store.dispatch(clearUser());

            return Promise.reject(refreshError);
          }
        } else {
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          console.log('No refresh token found. User needs to log in again.');

          store.dispatch(clearUser());
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;