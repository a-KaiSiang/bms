import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

export default configureStore({
    //reducer is function that initialize and update the state.
    reducer : {
        user : userReducer
    },
})