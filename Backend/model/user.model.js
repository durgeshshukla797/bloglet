import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
   fullname:{
     type:String,
     required:true,
     trim:true //built-in setter that automatically removes all leading and trailing whitespace from a string before saving it to the database. 
   },
   username:{
      type:String,
      required:true,
      trim:true,
      lowercase:true,
      unique:true
   },
   email:{
    type:String,
     required:true,
     trim:true,
     lowercase:true,
     unique:true
   },
   password:{
      type:String,
      required:true
   },
   refreshToken:{
    type:String
   }
},{timestamps:true})

const User = mongoose.model('User',userSchema)

export default User;