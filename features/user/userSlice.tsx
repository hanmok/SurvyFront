import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    userId: number;
    accessToken: string;
    refreshToken: string;
}

const initialState: UserState = {
    // userId: undefined,
    // accessToken: undefined,
    // refreshToken: undefined,
    userId: 774,
    accessToken: "access",
    refreshToken: "refresh",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (
            state,
            action: PayloadAction<{
                userId: number;
                accessToken: string;
                refreshToken: string;
            }>
        ) => {
            const { userId, accessToken, refreshToken } = action.payload;
            state.userId = userId;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
        },
        logoutAction: state => {
            state.userId = undefined;
            state.accessToken = undefined;
            state.refreshToken = undefined;
        },
    },
});

export const { setUserInfo, logoutAction } = userSlice.actions;
export default userSlice.reducer;
