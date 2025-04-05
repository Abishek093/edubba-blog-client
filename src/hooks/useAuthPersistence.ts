// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { setUser } from '../store/slices/authSlice';
// import { useGetUserQuery } from '../store/services/authApi';
// import Cookies from 'js-cookie';

// export const useAuthPersistence = () => {
//   const dispatch = useDispatch();
//   const accessToken = Cookies.get('accessToken');
  
//   const { data: userData, isSuccess } = useGetUserQuery(undefined, {
//     skip: !accessToken
//   });

//   useEffect(() => {
//     if (isSuccess && userData) {
//       dispatch(setUser(userData));
//     }
//   }, [userData, isSuccess, dispatch]);

//   return { isAuthenticated: !!accessToken };
// };


import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import { useGetUserQuery } from '../store/services/authApi';
import Cookies from 'js-cookie';

export const useAuthPersistence = () => {
  const dispatch = useDispatch();
  const { data: userData, isSuccess, isError } = useGetUserQuery();

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    
    // Only try to get user data if we have a token
    if (accessToken && isSuccess && userData) {
      console.log('Setting user from persistence hook:', userData);
      dispatch(setUser(userData));
    }
    
    if (isError) {
      console.log('Error fetching user data in persistence hook');
      // You might want to handle token refresh or clear invalid tokens here
    }
  }, [dispatch, isSuccess, isError, userData]);
};