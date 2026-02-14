import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js'

const activeCheck = async(req, res)=>{
    res.status(200).json("Server is running")
}



export default activeCheck;







export const createPost = async (req, res) => {
  try {
    const { token , body} = req.body;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await new Post({
      userId: user._id,
      body: body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });
    await posts.save();
    res.status(200).json({ message: "Post Created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name username email, profilePicture")
      .populate();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deletePost = async (req, res) => {
  const { token, postId } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (String(post.userId) !== String(user._id)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Post.deleteOne({ _id: post._id });
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const incrementLikes = async (req, res) => {
  const { postId, token } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.active) {
      return res.status(400).json({ message: "Post is inactive" });
    }

    const alreadyLiked = post.likedBy.some(
      id => id.toString() === user._id.toString()
    );

    if (alreadyLiked) {
      return res.status(400).json({ message: "Already liked" });
    }

    post.likedBy.push(user._id);
    post.likes += 1;
    await post.save();

    res.status(200).json({
      postId: post._id.toString(),
      likes: post.likes,
      isLiked: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const decrementLikes = async (req, res) => {
  const { postId, token } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.active) {
      return res.status(400).json({ message: "Post is inactive" });
    }

    const alreadyLiked = post.likedBy.some(
      id => id.toString() === user._id.toString()
    );

    if (!alreadyLiked) {
      return res.status(400).json({ message: "Not liked yet" });
    }

    post.likedBy = post.likedBy.filter(
      id => id.toString() !== user._id.toString()
    );
    post.likes -= 1;
    await post.save();

    res.status(200).json({
      postId: post._id.toString(),
      likes: post.likes,
      isLiked: false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

    
