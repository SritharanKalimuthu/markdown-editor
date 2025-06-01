import { verifyToken, generateAccessToken } from "../utils/generateToken.js";

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  const payload = await verifyToken(refreshToken);
  if (!payload) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const newAccessToken = await generateAccessToken({ _id: payload.id });

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Access token refreshed" });
};
