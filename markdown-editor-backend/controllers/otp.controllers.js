import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const verifyOtp = async (req, res) => {
    try {
        const { identifier, otp } = req.body;

        const otpRecord = await Otp.findOne({ identifier }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(404).json({ message: 'OTP not found' });
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        const isMatch = await bcrypt.compare(otp, otpRecord.otp);
        if (!isMatch) {
            return res.status(404).json({ message: 'Invalid OTP' });
        }

        await Otp.deleteMany({ identifier });

        let user = await User.findOne({ email: identifier });
        if (!user) {
            user = await User.create({ email: identifier });
        }

        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, 
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            message: "OTP verified successfully",
            user: {
                name: user.name,
                email: user.email,
                userKey: user.userKey
            }
        });
    } catch (err) {
        console.error("Error verifying OTP:", err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
};