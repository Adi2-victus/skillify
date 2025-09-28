import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authslice"; 
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";
import { aiAssistantApi } from "@/features/api/aiAssistantApi";
import { lectureNoteApi } from "@/features/api/lectureNoteApi";
const rootRedcuer = combineReducers({
    [authApi.reducerPath]:authApi.reducer,
    [courseApi.reducerPath]:courseApi.reducer,
    [purchaseApi.reducerPath]:purchaseApi.reducer,
    [courseProgressApi.reducerPath]:courseProgressApi.reducer,
    [aiAssistantApi.reducerPath]:aiAssistantApi.reducer,
    [lectureNoteApi.reducerPath]:lectureNoteApi.reducer,
    auth:authReducer, 
});
export default rootRedcuer;