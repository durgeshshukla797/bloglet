import jwt from 'jsonwebtoken'

export function generateRefreshToken(userId) {
  return  jwt.sign(
    {
      id:userId
    },
   process.env.REFRESH_TOKEN_SECRET,
   {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY || "15m"
   }
  )
}