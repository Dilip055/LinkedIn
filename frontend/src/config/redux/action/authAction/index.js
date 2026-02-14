import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue({
          message: "Token not found",
        });
      }
      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        name:user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/getUserProfile", {
        params: { token: user.token },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);


export const acceptRequest = createAsyncThunk(
  "user/acceptRequest",
  async (user, thunkAPI) => {
    console.log("Accepting request with data:", user);
    try {
      const response = await clientServer.post("/accept_connection_request", {
       token: user.token,
       requestId: user.requestId,
       acceptType: user.acceptType
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);


export const getAllUsers = createAsyncThunk('Post/getAllUser', async(_, thunkAPI)=>{
    try {
      
        const response = await clientServer.get('/getAllUsersProfile')
       return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
}) 


export const searchProfile = createAsyncThunk(
  "User/searchProfiles",
  async (query, thunkAPI) => {
    try {
      const response = await clientServer.get("/searchProfiles", {
        params: { query },  
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getConnectionRequest = createAsyncThunk(
  "User/getConnectionRequest",
  async (token, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_connection_requests", {
        params: { token },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  "User/sendConnectionRequest",
  async ({ token, connectionId }, thunkAPI) => {  
    try {
      const response = await clientServer.post("/connection_request_send", {
        token,
        connectionId,
      });
      return thunkAPI.fulfillWithValue(response.data);  
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


