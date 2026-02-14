import {Router} from "express";
import activeCheck, { createPost, decrementLikes, deletePost, getAllPost, incrementLikes } from "../controllers/post.controller.js";
import multer from "multer";
import { addComment, deleteComment } from "../controllers/user.controller.js";




const router = Router();





const storage = multer.diskStorage({
    destination:(req, res, cb)=>{
        cb(null, "uploads/posts/")
    },
    filename:(req, file, cb)=>{
        cb(null, file.originalname)
    }
})


const upload = multer({storage})


router.get('/',activeCheck);
router.post("/createPost" ,upload.single("media"), createPost);
router.get('/getAllPost', getAllPost);
router.delete('/deletePost', deletePost);
router.post("/like", incrementLikes)
router.post("/removeLike", decrementLikes);
router.post("/addComment", addComment);
router.post("/deleteComment", deleteComment);


export default router;