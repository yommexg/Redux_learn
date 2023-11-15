import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";

const postsAdpater = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

// const initialState = {
//   posts: [],
//   status: "idle", // idle | loading | succeded | failed
//   error: null,
//   count: 0,
// };

// export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
//   try {
//     const response = await axios.get(POSTS_URL);
//     return [...response.data];
//   } catch (error) {
//     return error.message;
//   }
// });

// export const addNewPost = createAsyncThunk(
//   "posts/addNewPost",
//   async (newPost) => {
//     try {
//       const response = await axios.post(POSTS_URL, newPost);
//       return response.data;
//     } catch (error) {
//       return error.message;
//     }
//   }
// );

// export const updatePost = createAsyncThunk(
//   "posts/updatePost",
//   async (initialPost) => {
//     const { id } = initialPost;
//     try {
//       const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
//       return response.data;
//     } catch (error) {
//       // return error.message;
//       return initialPost; // only for testing
//     }
//   }
// );

// export const deletePost = createAsyncThunk(
//   "posts/deletePost",
//   async (initialPost) => {
//     const { id } = initialPost;
//     try {
//       const response = await axios.delete(`${POSTS_URL}/${id}`);
//       if (response?.status === 200) return initialPost;
//       return `${response?.status}: ${response?.statusText}`;
//     } catch (error) {
//       return error.message;
//     }
//   }
// );

// const postSlice = createSlice({
//   name: "posts",
//   initialState,
//   reducers: {
//     // postAdded: {
//     //   reducer(state, action) {
//     //     state.posts.push(action.payload);
//     //   },
//     //   prepare(title, content, userId) {
//     //     return {
//     //       payload: {
//     //         id: nanoid(),
//     //         title,
//     //         content,
//     //         date: new Date().toISOString(),
//     //         userId,
//     //         reactions: {
//     //           thumbsUp: 0,
//     //           wow: 0,
//     //           heart: 0,
//     //           rocket: 0,
//     //           coffee: 0,
//     //         },
//     //       },
//     //     };
//     //   },
//     // },
//     reactionAdded: {
//       reducer(state, action) {
//         const { postId, reaction } = action.payload;
//         // const existingPost = state.posts.find((post) => post.id === postId);
//         const existingPost = state.entities[postId];
//         if (existingPost) {
//           existingPost.reactions[reaction]++;
//         }
//       },
//     },
//     increaseCount: {
//       reducer(state) {
//         state.count = state.count + 1;
//       },
//     },
//   },
//   extraReducers(builder) {
//     builder
//       .addCase(fetchPosts.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchPosts.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         let min = 1;
//         const loadedPosts = action.payload.map((post) => {
//           post.date = sub(new Date(), { minutes: min++ }).toISOString();
//           post.reactions = {
//             thumbsUp: 0,
//             wow: 0,
//             heart: 0,
//             rocket: 0,
//             coffee: 0,
//           };
//           return post;
//         });

//         // add any fetched posts to the array
//         // state.posts = state.posts.concat(loadedPosts);
//         postsAdpater.upsertMany(state, loadedPosts);
//       })
//       .addCase(fetchPosts.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })
//       .addCase(addNewPost.fulfilled, (state, action) => {
//         action.payload.userId = Number(action.payload.userId);
//         action.payload.date = new Date().toISOString();
//         action.payload.reactions = {
//           thumbsUp: 0,
//           wow: 0,
//           heart: 0,
//           rocket: 0,
//           coffee: 0,
//         };

//         // state.posts.push(action.payload);
//         postsAdpater.addOne(state, action.payload);
//       })
//       .addCase(updatePost.fulfilled, (state, action) => {
//         if (!action.payload?.id) {
//           console.log("Update could not complete");
//           console.log(action.payload);
//           return;
//         }
//         // const { id } = action.payload;
//         action.payload.date = new Date().toISOString();
//         // const posts = state.posts.filter((post) => post.id !== id);
//         // state.posts = [...posts, action.payload];
//         postsAdpater.upsertOne(state, action.payload);
//       })
//       .addCase(deletePost.fulfilled, (state, action) => {
//         if (!action.payload?.id) {
//           console.log("Delete could not complete");
//           console.log(action.payload);
//           return;
//         }
//         const { id } = action.payload;
//         // const posts = state.posts.filter((post) => post.id !== id);
//         // state.posts = posts;
//         postsAdpater.removeOne(state, id);
//       });
//   },
// });

const initialState = postsAdpater.getInitialState({
  status: "idle", // idle | loading | succeded | failed
  error: null,
  count: 0,
});

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      transformResponse: (responseData) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          return post;
        });
        return postsAdpater.setAll(initialState, loadedPosts);
      },
      providesTags: (result) => [
        { type: "Post", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Post", id })),
      ],
    }),

    getPostByUserId: builder.query({
      query: (id) => `/posts/?userId=${id}`,
      transformResponse: (responseData) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          return post;
        });
        return postsAdpater.setAll(initialState, loadedPosts);
      },
      providesTags: (result) => [
        ...result.ids.map((id) => ({ type: "Post", id })),
      ],
    }),

    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, err, arg) => [{ type: "Post", id: arg.id }],
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, err, arg) => [{ type: "Post", id: arg.id }],
    }),
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: "PATCH",
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          // updateQueryData takes three arguments: the name of the endpoint to update, the same cache key value used to identify the specific cached data, and a callback that updates the cached data.
          extendedApiSlice.util.updateQueryData(
            "getPosts",
            undefined,
            (draft) => {
              // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
              const post = draft.entities[postId];
              if (post) post.reactions = reactions;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByUserIdQuery,
  useAddNewPostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;

// returns query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

// create memoized selector
const selectPostData = createSelector(
  selectPostsResult,
  (postsResult) => postsResult.data // normalized state objects with ids and entities
);

//get selectors creates these selectors and we rename them with alliases using destruc  turing

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdpater.getSelectors((state) => selectPostData(state) ?? initialState);

// // export const selectAllPosts = (state) => state.posts.posts;
// export const getPostStatus = (state) => state.posts.status;
// export const getPostError = (state) => state.posts.error;
// export const getCount = (state) => state.posts.count;

// // export const selectPostById = (state, postId) =>
// //   state.posts.posts.find((post) => post.id === postId);

// export const selectPostsByUsers = createSelector(
//   [selectAllPosts, (state, userId) => userId],
//   (posts, userId) => posts.filter((post) => post.userId === userId)
// );

// export const { reactionAdded, increaseCount } = postSlice.actions;

// export default postSlice.reducer;
