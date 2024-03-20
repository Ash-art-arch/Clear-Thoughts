import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
    // get details from frontend
    // check if all fields are entered
    // check if user exists
    // create user and remove password and refreshToken
    // check if user is created
    // return response

    const {username, password} = req.body

    if(
        [username, password].some((input) => input?.trim === "")
    ){
        throw new Error("Enter the required fields")
    }

    const doesUserExist = await User.findOne({username}) 
    
    if(doesUserExist){
        throw new Error("User already exists!!")
    }

    const user = await User.create({
        username,
        password
    })

    const registeredUser = await User.findById(user._id).select("-password -refreshToken")

    if(!registeredUser){
        throw new Error("Something went wrong!! User is not registered.")
    }

    return res.status(201)
    .json(registeredUser, "User registered successfully")
})

export { registerUser }