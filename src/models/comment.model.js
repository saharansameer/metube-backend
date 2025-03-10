import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      match: [/[a-zA-Z0-9]/, "Comment can not be empty"]
    },
    commentBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video"
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet"
    }
  },
  { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);
