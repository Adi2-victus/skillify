// File: src/features/api/aiAssistantApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const AI_ASSISTANT_API = "import.meta.env.VITE_BACKEND_URL/api/v1/ai";

export const aiAssistantApi = createApi({
  reducerPath: "aiAssistantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: AI_ASSISTANT_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    askAssistant: builder.mutation({
      query: (body) => ({
        url: "/assist",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAskAssistantMutation } = aiAssistantApi;