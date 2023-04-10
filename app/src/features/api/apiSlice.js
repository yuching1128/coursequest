import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/' }),
    tagTypes: ['Review', 'Timeslots', 'Appointments'],
    endpoints: builder => ({
        getCourses: builder.query({
            query: ({ universityId, page, size }) => {
                return `university/${universityId}/courses?pageNum=${page}&pageSize=${size}`
            }
        }),
        getCourse: builder.query({
            query: ({ universityId, courseId }) => `university/${universityId}/courses/${courseId}`
        }),
        getCourseReviews: builder.query({
            query: ({ universityId, courseId }) => `university/${universityId}/courses/${courseId}/review`,
            providesTags: ['Review']
        }),
        getDepartments: builder.query({
            query: universityId => `university/${universityId}/departments`
        }),
        getLevels: builder.query({
            query: universityId => `university/${universityId}/levels`
        }),
        getUserReviews: builder.query({
            query: userId => `/user/${userId}/reviews`,
            providesTags: ['Review']
        }),
        addNewReview: builder.mutation({
            query: ({ universityId, courseId, newReview }) => ({
                url: `university/${universityId}/courses/${courseId}/review`,
                method: 'POST',
                body: newReview
            }),
            invalidatesTags: ['Review']
        }),
        editReview: builder.mutation({
            query: ({ universityId, courseId, reviewId, editedReview }) => ({
                url: `university/${universityId}/courses/${courseId}/review/${reviewId}`,
                method: 'PUT',
                body: editedReview
            }),
            invalidatesTags: ['Review']
        }),
        deleteReview: builder.mutation({
            query: ({ universityId, courseId, reviewId }) => ({
                url: `university/${universityId}/courses/${courseId}/review/${reviewId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Review']
        }),
        getAdvisorTimeslots: builder.query({
            query: advisorId => `/advisor/${advisorId}/all`,
            providesTags: ['Timeslots']
        }),
        getFreeAdvisorTimeslots: builder.query({
            query: () => `/advising/free`,
            providesTags: ['Timeslots']
        }),
        addNewTimeslot: builder.mutation({
            query: ({ newTimeslot }) => ({
                url: `advising/timeslot/add`,
                method: 'POST',
                body: newTimeslot
            }),
            invalidatesTags: ['Timeslots']
        }),
        deleteTimeslot: builder.mutation({
            query: ({ timeslotId }) => ({
                url: `advising/${timeslotId}/delete`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Timeslots']
        }),
        getUserInfo: builder.query({
            query: ({ userId }) => `user/${userId}/profile`
        }),
        getUniversity: builder.query({
            query: () => `university/types`
        }),
        getDegree: builder.query({
            query: universityId => `university/${universityId}/degreeTypes`
        }),
        getMajor: builder.query({
            query: () => `major/types`
        }),
        addUserUniversity: builder.mutation({
            query: ({ userId, universityId }) => ({
                url: `user/university`,
                method: 'POST',
                params: { userId: userId, universityId: universityId }
            }),
        }),
        addUserDegree: builder.mutation({
            query: ({ userId, degreeId }) => ({
                url: `user/degree`,
                method: 'POST',
                params: { userId: userId, degreeId: degreeId }
            }),
        }),
        addUserMajor: builder.mutation({
            query: ({ userId, majorId }) => ({
                url: `user/major`,
                method: 'POST',
                params: { userId: userId, majorId: majorId }
            }),
        }),
        addUserCourseTaken: builder.mutation({
            query: ({ userId, courseList }) => ({
                url: `user/course`,
                method: 'POST',
                params: { userId },
                body: courseList
            }),
        }),
        addUserCourseInterested: builder.mutation({
            query: ({ userId, courseList }) => ({
                url: `user/interested`,
                method: 'POST',
                params: { userId },
                body: courseList
            }),
        }),
        addUserConcentration: builder.mutation({
            query: ({ userId, concentration }) => ({
                url: `user/concentration`,
                method: 'POST',
                params: { userId: userId, concentration: concentration }
            }),
        }),
        addUserMentorCourse: builder.mutation({
            query: ({ userId, courseList }) => ({
                url: `user/mentorCourse`,
                method: 'POST',
                params: { userId },
                body: courseList
            }),
        }),
        addNewAppointment: builder.mutation({
            query: ({ newAppointment }) => ({
                url: `advising/book`,
                method: 'POST',
                body: newAppointment
            }),
            invalidatesTags: ['Timeslots']
        }),
        getAdvisorAppointments: builder.query({
            query: advisorId => `/advising/advisor/${advisorId}/appointments`,
            providesTags: ['Timeslots']
        }),
        getAdviseeAppointments: builder.query({
            query: adviseeId => `/advising/advisee/${adviseeId}/appointments`,
            providesTags: ['Timeslots']
        })
    })
})

export const {
    useGetCoursesQuery,
    useGetCourseQuery,
    useGetCourseReviewsQuery,
    useGetDepartmentsQuery,
    useGetLevelsQuery,
    useGetUserReviewsQuery,
    useAddNewReviewMutation,
    useEditReviewMutation,
    useDeleteReviewMutation,
    useGetAdvisorTimeslotsQuery,
    useGetFreeAdvisorTimeslotsQuery,
    useAddNewTimeslotMutation,
    useDeleteTimeslotMutation,
    useAddNewAppointmentMutation,
    useGetAdvisorAppointmentsQuery,
    useGetAdviseeAppointmentsQuery,
    useGetUserInfoQuery,
    useGetUniversityQuery,
    useGetDegreeQuery,
    useGetMajorQuery,
    useAddUserUniversityMutation,
    useAddUserDegreeMutation,
    useAddUserMajorMutation,
    useAddUserCourseTakenMutation,
    useAddUserCourseInterestedMutation,
    useAddUserConcentrationMutation,
    useAddUserMentorCourseMutation
} = apiSlice