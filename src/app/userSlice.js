import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name : "userInfo",
    initialState : {
        loginSuccess : false,
        username : "",
        token : "",
    },
    reducers : {
        loginSuccess : (state, action) => {
            state.loginSuccess = true;
            state.username = action.payload.u;
            state.token = action.payload.t;
        },

        clearLoginState : (state) => {
            state.loginSuccess = false;
            state.username = "";
            state.token = "";
        }
    }
})

export const {loginSuccess, clearLoginState} = userSlice.actions;

export default userSlice.reducer;