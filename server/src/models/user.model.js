import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is required!!"],
        unique: true,
        trim: true
    },
    password: {
        type: String, 
        required: [true, "password is required!!"],
        minLength: [6, "password should not be less than 6 characters!"],
        maxLength: [12, "password should not be greater than 12 characters!"],
        trim: true
    },
    blogPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Blog"
        }
    ],
    refreshToken: {
        type: String,
    }
}, {timestamps: true})


export const User = mongoose.model("User", userSchema)