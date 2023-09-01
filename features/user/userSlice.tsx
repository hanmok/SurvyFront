import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    userId: number;
    accessToken: string;
    refreshToken: string;
}

const initialState: UserState = {
    userId: -1,
    accessToken: "",
    refreshToken: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (
            state,
            action: PayloadAction<{
                userState: UserState;
            }>
        ) => {
            const { userId, accessToken, refreshToken } =
                action.payload.userState;
            state = { ...state, userId, accessToken, refreshToken };
        },
        logoutAction: state => {
            state = {
                ...state,
                userId: undefined,
                accessToken: undefined,
                refreshToken: undefined,
            };
        },
    },
});

export const { setUserInfo, logoutAction } = userSlice.actions;
export default userSlice.reducer;
