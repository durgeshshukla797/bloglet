import jwt from 'jsonwebtoken'


export async function generateAccessToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn:process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );
}
