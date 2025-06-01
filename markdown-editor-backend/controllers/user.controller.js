import bcrypt from "bcryptjs";
import user from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import otpGenerator from "otp-generator";
import sendOtpEmail from "../utils/otpGenerator.js";
import crypto from "crypto";
import { createFolder } from "../utils/googleService.js";

export const getUser = async(req, res) => {
    try{
        // console.log("Received Data:", req.query);
        const { email } = req.query;

        const isUserExist = await user.findOne({ email });
        if(!isUserExist){
            res.status(400).json({ message: "User does not exist" });
            return;
        }
        
        res.status(200).json({ message: "success", user: {name:isUserExist.name, email:isUserExist.email} });
    }catch(err){
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
};

export const registerUser = async(req, res) => {
    try{
        // console.log("Received Data:", req.body);
        const { name , email, password } = req.body;

        const isUserExist = await user.findOne({ email });
        if(isUserExist){
            res.status(400).json({ message: "User already exists" });
            return;
        }
        
        const userKey = crypto.randomBytes(6).toString('hex');

        const folderId = await createFolder(userKey);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new user({
        name,
        email,
        password: hashedPassword,
        driveFolderId: folderId,
        userKey: userKey,
        });

        await newUser.save();

        const otp = otpGenerator.generate(6, { digits: true, alphabets: true, upperCase: false, specialChars: false });
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const hashedOtp = await bcrypt.hash(otp, 10);

        const newOtp = new Otp({ identifier: newUser.email, otp:hashedOtp, expiresAt });
        await newOtp.save();
        
        sendOtpEmail(email, otp, newUser.name)
        .then(() => console.log("OTP email sent successfully"))
        .catch(console.error);

        res.status(201).json({ message: "OTP email sent successfully" , user: {name:newUser.name, email:newUser.email} });
    }catch(err){
        res.status(500).json({ message: "Internal Server Error", error: err });
    };
}

export const loginUser = async( req, res ) =>{
    try{
        // console.log("Received Data:", req.body);
        const { email, password } = req.body;

        const isUserExist = await user.findOne({ email });
        if(!isUserExist){
            res.status(404).json({message:"User not found"})
        }

        const isMatch = await bcrypt.compare(password, isUserExist.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const otp = otpGenerator.generate(6, { digits: true, alphabets: true, upperCase: false, specialChars: false });
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const hashedOtp = await bcrypt.hash(otp, 10);

        const newOtp = new Otp({ identifier: isUserExist.email, otp:hashedOtp, expiresAt });
        await newOtp.save();
        
        sendOtpEmail(email, otp, isUserExist.name)
        .then(() => console.log("OTP email sent successfully"))
        .catch(console.error);

        res.status(201).json({ message: "OTP email sent successfully", user: {name:isUserExist.name, email:isUserExist.email} });
    }catch(err){
        res.status(500).json({ message: "Internal Server Error", error: err });
    };
};

export const changeUserName = async( req, res ) => {
    try{
        console.log("Received Data:", req.body);
        const { email, name, password } = req.body;

        const isUserExist = await user.findOne({ email });
        if(!isUserExist){
            res.status(404).json({message:"User not found"})
        }

        const isMatch = await bcrypt.compare(password, isUserExist.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        isUserExist.name = name;
        await isUserExist.save();

        res.status(200).json({ message: "success", user: {name:isUserExist.name, email:isUserExist.email} });
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
}