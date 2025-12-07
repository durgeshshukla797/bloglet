import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export async function verifyJwt(req, res, next) {
   // take access token from cookies or header
   // decode that token and get the id of user
   // once we get the user we'll store essential info in req.user
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");


    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorised request"
      });
    }

    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Access Token !"
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid Access Token"
    });
  }
}
