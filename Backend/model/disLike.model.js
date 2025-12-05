import mongoose,{Schema} from "mongoose";
  
const likeSchema =new Schema({
   blog:{
    type:Schema.Types.ObjectId,
    ref:"Blog"
  },
  disLikedBy:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
},{timestamps:true})

export const Dislike = mongoose.model("Like",likeSchema)