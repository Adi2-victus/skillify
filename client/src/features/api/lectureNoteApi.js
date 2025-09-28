import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const LECTURE_NOTE_API = "http://localhost:3000/api/v1/notes";

export const lectureNoteApi = createApi({
  reducerPath: "lectureNoteApi",
  baseQuery: fetchBaseQuery({
    baseUrl: LECTURE_NOTE_API,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    uploadLectureNote: builder.mutation({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
        headers: {
          // Remove Content-Type to let browser set it
        },
      }),
    }),
    // getLectureNotes: builder.query({
    //   query: ({ lectureId, userId }) => `/${lectureId}?userId=${userId}`,
    // }),
    // Update the getLectureNotes endpoint
getLectureNotes: builder.query({
  query: ({ courseId, lectureId }) => `/?courseId=${courseId}&lectureId=${lectureId}`,
  transformResponse: (response) => response.notesWithUrls || response,
}),
    deleteLectureNote: builder.mutation({
      query: (noteId) => ({
        url: `/${noteId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { 
  useUploadLectureNoteMutation, 
  useGetLectureNotesQuery, 
  useDeleteLectureNoteMutation 
} = lectureNoteApi;