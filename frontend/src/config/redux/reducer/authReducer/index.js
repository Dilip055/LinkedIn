import {
  acceptRequest,
  getAllUsers,
  getConnectionRequest,
  getMyConnectionRequest,
  getUserProfile,
  loginUser,
  registerUser,
  searchProfile,
  searchProfiles,
} from "../../action/authAction";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  loggedIn: false,
  message: "",
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_Profiles: [],
  all_Profile_fetch: false,
  searchProfiles: [],
  searchLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.loggedIn = true;
        state.isSuccess = true;
        state.message = "Login Successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Login failed";
      })
      .addCase(registerUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "Registration successful. Please Login!";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Registration failed";
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload.profile;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_Profile_fetch = true;
        state.all_Profiles = action.payload;
      })
      .addCase(searchProfile.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchProfile.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchProfiles = action.payload; // array from API
      })
      .addCase(searchProfile.rejected, (state) => {
        state.searchLoading = false;
        state.searchProfiles = [];
      })
      .addCase(getConnectionRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.connectionRequest = action.payload;
      })
      .addCase(getConnectionRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConnectionRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to fetch connections";
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message || "Connection accepted";
      })
      .addCase(acceptRequest.pending, (state) => {
        state.isLoading = true;
        state.message = "Accepting connection...";
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to accept connection";
      })

      
  },
});

export const { reset, emptyMessage } = authSlice.actions;
export default authSlice.reducer;
