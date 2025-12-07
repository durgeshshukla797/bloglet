import User  from "../model/user.model.js"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import { generateAccessToken } from "../utils/generateAccessToken.js";
import { generateRefreshToken } from "../utils/generateRefreshToken.js";

async function generateAccessAndRefreshTokens(userId) {
  try {
    //console.log("UserId received:", userId);

    const accessToken = await generateAccessToken(userId);
    const refreshToken = await generateRefreshToken(userId);

    // console.log("Generated Access Token:", accessToken);
    // console.log("Generated Refresh Token:", refreshToken);

    const user = await User.findById(userId);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Token Generation Error:", error);
    throw new Error("Token generation failed");
  }
}


export async function register(req,res) {
     const{fullname,username,email,password} =req.body;
     
     // Proper validation - check if any field is empty or only whitespace
     if(!fullname?.trim() || !username?.trim() || !email?.trim() || !password?.trim()){
       return res.status(400)
                 .json({
                  success:false,
                  message:"All fields are required"
                 });
      }

     const existedUser=await User.findOne({
      $or:[{username},{email}]
     })

     if(existedUser){
      return res.status(400)
                .json({
                  success:false,
                  message:"User Already Exists"
                })
     }
     
     const hashPassword = await bcrypt.hash(password,10);//10 will be good other wise server will run slow

     const user = await User.create({
      fullname,
      username,
      email,
      password:hashPassword
     })

     const createdUser = await User.findById(user?._id).select("-password")
     if(!createdUser){
      return res.status(500)
                .json({
                  success:false,
                  message:"Something went wrong in creating user"
                })
     }

     return res.status(200)
               .json({
                success:true,
                message:"User created Successfully",
                user:createdUser
               })
}

export async function login(req,res) {
  // pahele details lo body se
  // fir check karo sari details aayi ki nahi ya fir null hi bhej diya
  // then mongodb me query maaro username se ki exist karta hai ki nahi if no then show middle finger
  // if it exists the match password with his hash password save in db 
  // if it matches then generate token & give response 200 
  // or else again show middle finger
  const {username,password}= req.body  
   
   if([username,password].some((field)=>{field?.trim()===" "})){
       return res.status(400)
                 .json({
                  success:false,
                  message:"All fields are required"
                 });
      }

    const existedUser=await User.findOne({username})

     if(!existedUser){
      return res.status(400)
                .json({
                  success:false,
                  message:"User does not Exists"
                })
     }
     
     const isPasswordValid = await bcrypt.compare(password,existedUser.password);
     if(!isPasswordValid){
        return res.status(400)
                .json({
                  success:false,
                  message:"Password Incorrect"
                })
     }

     const{accessToken, refreshToken}= await generateAccessAndRefreshTokens(existedUser._id);
    //  console.log(`AccessToken:${accessToken}`);
    //   console.log(`RefreshToken:${accessToken}`);
     const safeUser = await User.findById(existedUser._id).select("-email -password")
     if(!safeUser){
      return res.status(500)
                .json({
                  success:false,
                  message:"Something went wrong in logging user"
                })
     }
      
    const options = {
        httpOnly: true,
        secure: true
    }

      return res.status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json({
                  success: true,
                  message: "User logged In Successfully",
                  user: safeUser,
                  accessToken,
                  refreshToken
                });

}

export async function logout(req,res) {
  // logout karna hai means token ko expire kar do & also we know that to implement this user should be logged in to ise implement karne se pahele ek middleware run hoga
  // aur vo middleware verify karega ki user login hai ki nahi and request me user ki info store kar dega 
  // after getting user id we'll make refresh token =1 and clear the cookie
  
    await User.findByIdAndUpdate(
       req.user._id,
      {
         $unset:{
          refreshToken:1
         }
      },
      {
        new:true
      }
    )
    
     const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      success:true,
      user:{},
      message: "User logged Out"
    })

  
}

export async function refreshToken(req,res) {
  // is function me aaye ho to means access token expire ho gaya hai
  // refresh token lenge cookies se ya header se
  // then refresh token ko decode karke id nikal lenge
  // & fir usi id se db me stored refresh token and aur cookie se liye huye refresh token ko match karayenge 
  // if match then everything perfect and call generateAccessAndRefreshToken with options
  // else refresh token expired
  const userRefreshToken = req.cookies.refreshToken||req.body.refreshToken
  if(!userRefreshToken){
      return res.status(401)
                .json({
                      success:false,
                      message:"Unauthorised request"
                    }) 
  }

  try {
    const decodedToken= jwt.verify(userRefreshToken,process.env.REFRESH_TOKEN_SECRET);
   
    const user =await User.findById(decodedToken?.id);
    if(!user){
      return res.status(500)
                .json({
                  success:false,
                  message:"Invalid refresh token"
                })
    }
    
    if(userRefreshToken!==user.refreshToken){
      return res.status(500)
                .json({
                  success:false,
                  message:"refresh token is expired!"
                })
    }
  
    const options={
      httpOnly:true,
      secure:true
    }
  
    const {accessToken,refreshToken}=generateAccessAndRefreshTokens(user.id);
  
  return res.status(200)
                .cookie('accessToken',accessToken)
                .cookie('newRefreshToken',refreshToken)
                .json({
                  success:true,
                   accessToken,
                   refreshToken,
                  message:"Access Token Refreshed!!"
                })
  } catch (error) {
    return res.status(401)
              .json({
                success:false,
                message:error.message || "Invalid refresh token !!"
              })
  }
}
