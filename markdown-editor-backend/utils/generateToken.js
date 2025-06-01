import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";
const secret = new TextEncoder().encode(JWT_SECRET);
const alg = 'HS256';

export const generateAccessToken = async (userId) => {
  try {
    return await new SignJWT({ id: userId })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN || '1d')
      .sign(secret);
  } catch (err) {
    console.error("Access token generation failed:", err.message);
    throw err;
  }
};

export const generateRefreshToken = async (userId) => {
  try {
    return await new SignJWT({ id: userId })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);
  } catch (err) {
    console.error("Refresh token generation failed:", err.message);
    throw err;
  }
};

export const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return null;
  }
};
