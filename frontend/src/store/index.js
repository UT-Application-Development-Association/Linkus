import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/accountSlice";

export default configureStore({
    reducer: {
        accountReducer: accountReducer
    }
})
