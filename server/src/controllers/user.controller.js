import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const options = {
    httpOnly: true,
    secure: true
}

const generateAccessandRefreshTokens = async(userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken 
    user.save({validateBeforeSave:false})

    return {accessToken, refreshToken}
}

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

    const doesUserExist = await User.find({username}) 
    
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

const loginUser = asyncHandler(async(req, res) => {
    // get details from frontend
    // verify if fields are empty
    // check if user exists
    // compare password
    // generate access and refresh tokens

    const {username, password} = req.body
    
    if(
        [username, password].some((input) => input?.trim === "")
    ){
        throw new Error("Enter the required fields")
    }

    const user = await User.find({username}) 

    if(!user){
        throw new Error("Please register first.")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new Error("Password is incorrect.")
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshTokens(user._id)

    const loggedIn = await User.findById(user._id)

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(loggedIn)
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken : undefined
            } 
        },
        {
            new : true
        }
    )

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
        message: "User logged out."
    })
})

export { registerUser, loginUser, logoutUser }