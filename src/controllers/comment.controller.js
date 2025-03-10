import ApiError from "../utils/apiResponse.js";
import ApiResponse from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

const addCommentToVideo = async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  // Remove extra spaces from comment
  const trimmedContent = content.trim().replace(/\s+/g, " ");
  // Checks if comment is empty
  if (!trimmedContent) {
    throw new ApiError({ status: 400, message: "Comment content is empty" });
  }

  // Create Comment
  const comment = await Comment.create({
    content: trimmedContent,
    video: videoId,
    commentBy: req.user._id
  });
  // Checks for issue while creating comment document
  if (!comment) {
    throw new ApiError({
      status: 500,
      message: "Unable to add comment on video"
    });
  }

  // Final Response
  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Comment added successfully",
      data: comment
    })
  );
};

const addCommentToTweet = async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  // Remove extra spaces from comment
  const trimmedContent = content.trim().replace(/\s+/g, " ");
  // Checks if comment is empty
  if (!trimmedContent) {
    throw new ApiError({ status: 400, message: "Comment content is empty" });
  }

  // Creating Comment
  const comment = await Comment.create({
    content: trimmedContent,
    tweet: tweetId,
    commentBy: req.user._id
  });
  // Checks for issue while creating comment document
  if (!comment) {
    throw new ApiError({
      status: 500,
      message: "Unable to add comment on tweet"
    });
  }

  // Final Response
  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Comment added successfully",
      data: comment
    })
  );
};

const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  // Remove extra spaces from comment
  const trimmedContent = content.trim().replace(/\s+/g, " ");
  // Checks if comment is empty
  if (!trimmedContent) {
    throw new ApiError({ status: 400, message: "Comment content is empty" });
  }

  // Update Comment
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { content: trimmedContent },
    { new: true, runValidators: true }
  );
  if (!updatedComment) {
    throw new ApiError({ status: 200, message: "Unable to update comment" });
  }

  // Final Response
  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Comment updated successfully",
      data: updatedComment
    })
  );
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  // Delete Comment
  try {
    await Comment.findByIdAndDelete(commentId);
  } catch (err) {
    throw new ApiError({ status: 500, message: err.message });
  }

  // Final Response
  return res
    .status(200)
    .json(
      new ApiResponse({ status: 200, message: "Comment deleted successfully" })
    );
};

const getVideoComments = async (req, res) => {
  const { videoId } = req.params;
  const comments = await Comment.aggregate([
    {
      $match: {
        video: mongoose.isValidObjectId(videoId)
          ? new mongoose.Types.ObjectId(videoId)
          : null
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "commentBy",
        foreignField: "_id",
        as: "commentBy",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1
            }
          }
        ]
      }
    },
    {
      $addFields: {
        commentBy: {
          $first: "$commentBy"
        }
      }
    }
  ]);

  if (comments.length === 0) {
    throw new ApiError({ status: 400, message: "Video has no comments" });
  }

  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Video comments fetched successfully",
      data: comments
    })
  );
};

const getTweetComments = async (req, res) => {
  const { tweetId } = req.params;
  const comments = await Comment.aggregate([
    {
      $match: {
        tweet: mongoose.isValidObjectId(tweetId)
          ? new mongoose.Types.ObjectId(tweetId)
          : null
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "commentBy",
        foreignField: "_id",
        as: "commentBy",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1
            }
          }
        ]
      }
    },
    {
      $addFields: {
        commentBy: {
          $first: "$commentBy"
        }
      }
    }
  ]);

  if (comments.length === 0) {
    throw new ApiError({ status: 400, message: "Tweet has no comments" });
  }

  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Tweet comments fetched successfully",
      data: comments
    })
  );
};

export {
  addCommentToVideo,
  addCommentToTweet,
  updateComment,
  deleteComment,
  getVideoComments,
  getTweetComments
};
