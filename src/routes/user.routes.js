import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";

import {upload} from '../middlewares/multer.middleware.js'
import { verify } from "jsonwebtoken";
const router = Router()

router.route("/register").post(upload.fields([
    {
        name : "avatar",
        maxCount :  1
    },
    {
        name : "coverImage",
        maxCount : 1 
    }
]), registerUser)

router.route("/login").post(loginUser)
router.route("/logout").post()

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)

export default router