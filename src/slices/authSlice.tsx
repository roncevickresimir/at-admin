import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IUser from '../interfaces/IUser';
import { authService } from '../services/authService';

interface ILoginPayload {
    token: string;
    User: IUser;
}

interface IState {
    token: string | null;
}

const initialState: IState = {
    token: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(authService.endpoints.login.matchFulfilled, (state, action: PayloadAction<ILoginPayload>) => {
            const { token } = action.payload;
            state.token = token;
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
