import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userKey :{ type: String, required: true, unique: true },
    driveFolderId: { type: String, required:true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, match: [/.+\@.+\..+/, "Please use a valid email address"], },
    password: { type: String, required: true },
}, {
    timestamps: true,  
});

const User = mongoose.model("User", UserSchema);
export default User;