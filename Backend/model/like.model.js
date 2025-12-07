import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Like = mongoose.model("Like", likeSchema);

export default Like;

// Time mila to ise implement karenge
// comment:{// comment ko like karne ke liye ye field daala hai
  //   type:Schema.Types.ObjectId,
  //   ref:"Comment"
  // },