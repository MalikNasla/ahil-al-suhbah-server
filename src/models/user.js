import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: "String",
            required: true, 
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        roles: {
            type: [String],
            default: ["basic"]
        },
        passwordHash: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
)

const User = mongoose.model("User", UserSchema);
export default User