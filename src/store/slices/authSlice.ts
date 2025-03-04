// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface AuthState {
//   user: {
//     email: string;
//     username: string;
//     profilePicture?: string;
//     profession?: string;
//     bio?: string;
//     isVerified?: boolean;
//     isBlocked?: boolean;
//     isGoogleUser: boolean;
//     _id: string;
//   } | null;
//   accessToken: string | null;
//   refreshToken: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   accessToken: null,
//   refreshToken: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<AuthState>) => {
//       state.user = action.payload.user;
//       state.accessToken = action.payload.accessToken || null;
//       state.refreshToken = action.payload.refreshToken || null;
//     },
//     clearUser: (state) => {
//       state.user = null;
//       state.accessToken = null;
//       state.refreshToken = null;
//     },
//   },
// });

// export const { setUser, clearUser } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserResponse } from '../services/authApi'; 

interface UserState {
  user: IUserResponse | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserResponse>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;