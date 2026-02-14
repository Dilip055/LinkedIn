import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  active:{
    type:Boolean,
    default:true
  },
  password:{
    type:String,
    required:true
  },
  profilePicture:{
    type: String,
    default: 'https://thumbs.dreamstime.com/b/default-profile-picture-icon-high-resolution-high-resolution-default-profile-picture-icon-symbolizing-no-display-picture-360167031.jpg'

  },
  createdAt:{
    type:Date,
    default:Date.now()
  },
  token:{
    type:String,
    default:''
  }
});


const User = mongoose.model("User", userSchema);

export default User;
