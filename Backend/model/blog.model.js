import mongoose, { Schema } from "mongoose";

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

const Blog = mongoose.model('Blog',blogSchema)

export default Blog;