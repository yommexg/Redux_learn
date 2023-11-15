// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

// const USERS_URL = "https://jsonplaceholder.typicode.com/users";

// const initialState = [];

const usersAdpater = createEntityAdapter({
  sortComparer: (a, b) => b.name.localeCompare(a.name),
});

const initialState = usersAdpater.getInitialState();

// export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
//   try {
//     const response = await axios.get(USERS_URL);
//     return [...response.data];
//   } catch (error) {
//     return error.message;
//   }
// });

// const usersSlice = createSlice({
//   name: "users",
//   initialState,
//   reducers: {},
//   extraReducers(builder) {
//     builder.addCase(fetchUsers.fulfilled, (state, action) => {
//       return action.payload;
//     });
//   },
// });

export const userExtendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      transformResponse: (responseData) => {
        return usersAdpater.setAll(initialState, responseData);
      },
      providesTags: (result) => [
        { type: "User", id: "LIST" },
        ...result.ids.map((id) => ({ type: "User", id })),
      ],
    }),
  }),
});

export const { useGetUsersQuery } = userExtendedApiSlice;

//  export const selectAllUsers = (state) => state.users;

// export const selectUserById = (state, userId) =>
//   state.users.find((user) => user.id === userId);

// export default usersSlice.reducer;
