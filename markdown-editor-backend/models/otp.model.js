import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    identifier: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, {
    timestamps: true,
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); 

const Otp = mongoose.model("Otp", otpSchema,"user_otp");
export default Otp;

