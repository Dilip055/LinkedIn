import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer/index"
import postReducer from "./reducer/postReducer/index"
export const myStore = configureStore({
    reducer:{
        auth:authReducer,
        post:postReducer
    }
})