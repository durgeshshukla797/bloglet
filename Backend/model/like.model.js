import mongoose,{Schema} from "mongoose";
  
const likeSchema =new Schema({
   blog:{
    type:Schema.Types.ObjectId,
    ref:"Blog"
  },
  likedBy:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
},{timestamps:true})

export const Like = mongoose.model("Like",likeSchema)

// Time mila to ise implement karenge
// comment:{// comment ko like karne ke liye ye field daala hai
  //   type:Schema.Types.ObjectId,
  //   ref:"Comment"
  // },