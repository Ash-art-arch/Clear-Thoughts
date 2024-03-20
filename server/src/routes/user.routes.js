import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const userRouter = Router()

userRouter.route("/register").post(registerUser)
userRouter.route("/login").post(loginUser)

userRouter.route("/logout").post(verifyJwt ,logoutUser)

export { userRouter }