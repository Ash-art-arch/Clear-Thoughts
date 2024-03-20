import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema({
    authorName: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    coverImage: {
        type: String,
    },
    blogBody: {
        type: String, 
        required: [true, "Please enter the blog contents"],
        minLength: [200, "The blog must be at least 200 characters long"]
    }
}, {timestamps: true})

export const Blog = mongoose.model("Blog", blogSchema)