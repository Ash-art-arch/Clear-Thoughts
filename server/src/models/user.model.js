import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        maxLength: [18, "password should not be greater than 18 characters!"],
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

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            username : this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)