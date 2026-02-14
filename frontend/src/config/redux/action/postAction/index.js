import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPost = createAsyncThunk(
    "post/getAllPost", async(_, thunkAPI)=>{
        try {
             const response = await clientServer.get('/getAllPost');
        if(response){
            return thunkAPI.fulfillWithValue(response.data)
        }
        } catch (error) {
             return thunkAPI.rejectWithValue(error.response.data)
        }
       
    }
)

export const getAllUsers = createAsyncThunk('Post/getAllUser', async(_, thunkAPI)=>{
    try {
        const response = await clientServer('/')
    } catch (error) {
        
    }
}) 




export const createPost = createAsyncThunk("Post/createPost", async(userData, thunkAPI)=>{

    try {
        const {file, body}=userData
        const formData = new FormData()
        formData.append("token",localStorage.getItem("token"))
        formData.append('body', body)
        formData.append("media", file)
 



        const response = await clientServer.post('/createPost', 
            formData
        ,{
            headers:{
                'Content-Type' : 'multipart/form-data'
            }
        })
        if(response.status == 200){
            return thunkAPI.fulfillWithValue(response.data)
        }else{
            return thunkAPI.rejectWithValue(response.data.error)
        }
    } catch (error) {
         return thunkAPI.rejectWithValue(response.data.error)
    }
})


export const addLikes = createAsyncThunk(
  "Post/likes",
  async (postId, thunkAPI) => {
    try {
      const response = await clientServer.post("/like", {
        postId,
        token: localStorage.getItem("token"),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);



export const removeLikes = createAsyncThunk(
  "Post/removeLikes",
  async (postId, thunkAPI) => {
    try {
      const response = await clientServer.post("/removeLike", {
        postId,
        token: localStorage.getItem("token"),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);



export const addComment = createAsyncThunk(
  "Post/addComment",
  async (commentData, thunkAPI) => { 
    console.log("Comment Data:", commentData); 
    try {
      const response = await clientServer.post("/addComment", commentData);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    } 
  }
);

export const removeComment = createAsyncThunk(
  "Post/removeComment",
  async (commentData, thunkAPI) => {        


    try {
      const response = await clientServer.post("/removeComment", commentData);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {     
      return thunkAPI.rejectWithValue(error.response?.data);
    }     

  }
);      

export const getAllComments = createAsyncThunk(
  "Post/getAllComments",
  async ({postId}, thunkAPI) => {
    try {
      const response = await clientServer.get(`/getAllComments/${postId}`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    } 
  }
);


