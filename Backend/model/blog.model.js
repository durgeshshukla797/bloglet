import mongoose, { Schema } from "mongoose";
import Like from '../model/like.model.js'
import Dislike from '../model/disLike.model.js'
import Comment from '../model/comment.model.js'

const blogSchema = new Schema({
  title:{
      type:String,
      required:true,
      trim:true,
      maxlength:150
    },
  content: {
      type: String,
      required: true,
    },
  coverImage:{
    type:String,// cloudinary url hoga jo 3rd party generate karegi image store karne pr
   },
  author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
},{timestamps:true})

blogSchema.pre("findOneAndDelete", async function () {
  const blogId = this.getQuery()._id;

  if (!blogId) return;

  await Promise.all([
    Comment.deleteMany({ blog: blogId }),
    Like.deleteMany({ blog: blogId }),
    Dislike.deleteMany({ blog: blogId })
  ]);
});


const Blog = mongoose.model('Blog',blogSchema)

export default Blog;