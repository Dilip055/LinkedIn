import { createSlice } from "@reduxjs/toolkit";
import { addLikes, getAllComments, getAllPost, removeLikes } from "../../action/postAction";




const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: (state) => {
      Object.assign(state, initialState);
    },
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
  builder
    // ================= GET POSTS =================
    .addCase(getAllPost.pending, (state) => {
      state.isLoading = true;
      state.message = "Fetching all Posts...";
    })
    .addCase(getAllPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.postFetched = true;
      state.posts = action.payload;
    })
    .addCase(getAllPost.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload?.message || "Failed to fetch posts";
    })

    // ================= ADD LIKE =================
    .addCase(addLikes.fulfilled, (state, action) => {
      const { postId, likes, isLiked } = action.payload;
      const post = state.posts.find(p => p._id === postId);
      if (post) {
        post.likes = likes;
        post.isLiked = isLiked;
      }
      state.message = ""; // clear old error
    })
    .addCase(addLikes.rejected, (state, action) => {
      state.message = action.payload?.message || "Already liked";
    })

    // ================= REMOVE LIKE =================
    .addCase(removeLikes.fulfilled, (state, action) => {
      const { postId, likes, isLiked } = action.payload;
      const post = state.posts.find(p => p._id === postId);
      if (post) {
        post.likes = likes;
        post.isLiked = isLiked;
      }
      state.message = "";
    })
    .addCase(removeLikes.rejected, (state, action) => {
      state.message = action.payload?.message || "Not liked yet";
    })
    .addCase(getAllComments.fulfilled, (state, action) => {
      state.comments = action.payload.comments;
      state.postId = action.payload.postId;
    })
    
}
});
export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;
