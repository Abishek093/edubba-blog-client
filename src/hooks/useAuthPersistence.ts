import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import { useGetUserQuery } from '../store/services/authApi';
import Cookies from 'js-cookie';

export const useAuthPersistence = () => {
  const dispatch = useDispatch();
  const accessToken = Cookies.get('accessToken');
  
  const { data: userData, isSuccess } = useGetUserQuery(undefined, {
    skip: !accessToken
  });

  useEffect(() => {
    if (isSuccess && userData) {
      dispatch(setUser(userData));
    }
  }, [userData, isSuccess, dispatch]);

  return { isAuthenticated: !!accessToken };
};