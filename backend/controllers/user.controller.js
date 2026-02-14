import Profile from "../models/Profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import convertUserDataToPDF from "../utils/downloadProfile.js";
import path from "path";
import fs from "fs"
import connectionRequest from "../models/connections.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";



export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    console.log("Registering user with data:", req.body);
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await user.save();
    const profile = await new Profile({ userId: user._id });
    await profile.save();
    res.status(200).json({ message: "User created successfully", profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });

    res.status(200).json({ message: "Login Successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    user.profilePicture = req.file.filename;
    await user.save();

    res.status(200).json({ message: "Profile image uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newUser } = req.body;
    const userProfile = await User.findOne({ token });
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile_to_update = await Profile.findOne({ userId: userProfile._id });
    if (!profile_to_update) {
      return res.status(404).json({ message: "Profile not found" });
    }

    Object.assign(profile_to_update, newUser);
    await profile_to_update.save();

    res.status(200).json({ message: "Profile updated successfully", profile_to_update });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getUserandProfile = async (req, res) => {
  try {
    const user = await User.findOne({ token:req.query.token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const profile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );
    res.status(200).json({ profile: profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const updateUserProfile =async(req,res)=>{
  try {
    const {token, ...newUser} = req.body;
    console.log("new User profile--------", newUser);
    const user = await User.findOne({token});
     if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const {username, email} = newUser;
    const existingUser = await User.findOne({ $or: [ { username }, { email } ] });
    if(existingUser)
      if(existingUser && String(existingUser._id) !== String(user._id)){
      return res.status(400).json({ message: "Username or Email already in use by another account" });
    }
    Object.assign(user, newUser );
    await user.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 



export const getAllProfile = async(req, res)=>{
  try {
    const usersProfile = await Profile.find().populate("userId",'name username email profilePicture')
    return res.status(200).json(usersProfile);
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
}





export const downloadProfile = async(req, res)=>{
  try {
    const user_Id = req.query.id;
    const userData = await Profile.findOne({userId:user_Id}).populate('userId','name username email profilePicture')
    let a = await convertUserDataToPDF(userData);
    res.status(200).json({message: a})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



export const fileDownload = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join("uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.download(filePath, filename);
}





export const sendConnectionRequest = async(req, res)=>{
  const { token, connectionId} = req.body;
  try {
    console.log("Connection request received with token:", token, "and connectionId:", connectionId);
     const user = await User.findOne({token});
     if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connectionUser = await User.findOne({ _id:connectionId });
    if(!connectionUser){
      return res.status(404).json({ message: "Connection User not found" });
    }
    const existingConnectionRequest = await connectionRequest.findOne({userId:user._id, connectionId:connectionUser._id})
    if(existingConnectionRequest){
      return res.status(404).json({ message: "You have already requested" });
    }
    const request = await new connectionRequest({
      userId: user._id,
      connectionId: connectionUser._id
    })
    await request.save();
    res.status(200).json({message: "Request Send Successfully"})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}




export const getMyConnectionRequest = async(req, res)=>{
  const {token} = req.query;
  try {
    const user = await User.findOne({token});
     if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const myRequest = await connectionRequest.find({userId: user._id }).populate("connectionId",'username name email profilePicture');
    res.status(200).json(myRequest);
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
}


export const WhatmyConnectionRequest = async(req, res)=>{
  const {token} = req.body;
  try {
    const user = await User.findOne({token});
     if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connections = await connectionRequest.find({connectionId: user._id }).populate("userId",'username, name, email, profilePicture');
    res.status(200).json(connections);
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
}




export const acceptConnectionRequest = async (req, res) => {
  console.log("Accept connection request controller called with data:", req.body);
  const { token, requestId, action_type } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connction = await connectionRequest.findOne({ _id: requestId });
    if (!connction) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (action_type === "accept") {
      connction.status_accepted = true;
    } else {
      connction.status_accepted = false;
    }

    await connction.save();

    res.status(200).json({ message: "Request status updated", request: connction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






export const addComment = async(req, res)=>{
  console.log("Add comment controller called", req.body);
  const { token, postId, body} = req.body;
  try {
     const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findOne({_id:postId});
    if(!post){
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = await new Comment({
      userId: user._id,
      postId: post._id,
      body: body
    })
    await comment.save();
    res.status(200).json({ message: "Comment Added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getAllComments = async (req, res) => {
  const { postId } = req.params;
  try {
     const comments = await Comment.find({ postId })
      .populate("userId", "name username profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json({ comments: comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { token, commentId } = req.body;
  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    if (String(comment.userId) !== String(user._id)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await Comment.deleteOne({ _id: commentId });
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const searchProfiles = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(200).json([]);
    }

    // Find users matching search text
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("_id name username profilePicture");
    const userIds = users.map((u) => u._id);

    const profiles = await Profile.find({
      userId: { $in: userIds },
    }).populate("userId", "name username profilePicture");

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getUserProfileBasedOnUsername = async (req, res) => {
  const { username } = req.query;

  try { 
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const profile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );
    res.status(200).json({ profile: profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
