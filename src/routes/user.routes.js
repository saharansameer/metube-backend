import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getCurrentUser,
  updateUserAccountDetails,
  updateUserChannelDetails,
  changeUserPassword,
  getUserChannelProfile,
  getUserWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// GET - current user details
router
  .route("/info/:username")
  .get(asyncHandler(verifyJWT), asyncHandler(getCurrentUser));

// GET - User Channel Profile
// PATCH - fullname, username, email
router
  .route("/:username")
  .get(asyncHandler(getUserChannelProfile))
  .patch(asyncHandler(verifyJWT), asyncHandler(updateUserAccountDetails));

// PATCH - avatar, coverImage
router.route("/:username/channel").patch(
  asyncHandler(verifyJWT),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  asyncHandler(updateUserChannelDetails)
);

// PATCH - password
router
  .route("/:username/security")
  .patch(asyncHandler(verifyJWT), asyncHandler(changeUserPassword));

// GET - User Watch History
router
  .route("/:username/history")
  .get(asyncHandler(verifyJWT), asyncHandler(getUserWatchHistory));

// Error Handler
router.use(errorHandler);

export default router;
