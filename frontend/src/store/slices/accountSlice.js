import { createSlice } from "@reduxjs/toolkit";

export const accountSlice = createSlice({
    name: "AccountSlice",
    initialState: {
        user: null,
        isLogin: false,
    },
    reducers: {
        setIsLogin: (state, { payload: status }) => {
            state.isLogin = status;
        },
        setUser: (state, { payload: user }) => {
            state.user = user;
            if(state.user !== null) state.isLogin = true;
            return state;
        }
    }
})

export const {setIsLogin, setUser} = accountSlice.actions;
export default accountSlice.reducer;
