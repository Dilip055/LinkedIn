import { Router } from "express";
import {
  acceptConnectionRequest,
  addComment,
  deleteComment,
  downloadProfile,
  fileDownload,
  getAllComments,
  getAllProfile,
  getMyConnectionRequest,
  getUserandProfile,
  getUserProfileBasedOnUsername,
  login,
  register,
  searchProfiles,
  searchLocations,
  sendConnectionRequest,
  updateProfileData,
  updateUserProfile,
  uploadProfilePicture,
} from "../controllers/user.controller.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router
  .route("/profile_picture")
  .post(upload.single("profilePicture"), uploadProfilePicture);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_profile_update").post(updateProfileData);
router.route("/getUserProfile").get(getUserandProfile);
router.route("/updateUserProfile").post(updateUserProfile);
router.route("/getAllUsersProfile").get(getAllProfile);
router
  .route("/getUserProfileBasedOnUsername")
  .get(getUserProfileBasedOnUsername);
router.route("/downloadProfile").get(downloadProfile);
router.route("/downloadFile/:filename").get(fileDownload);
router.route("/connection_request_send").post(sendConnectionRequest);
router.route("/get_connection_requests").get(getMyConnectionRequest);
router.route("/accept_connection_request").post(acceptConnectionRequest);
router.route("/add_comment").post(addComment);
router.route("/getAllComments/:postId").get(getAllComments);
router.route("/delete_comment").get(deleteComment);
router.route("/searchProfiles").get(searchProfiles);
router.route("/search_locations").get(searchLocations);

export default router;
