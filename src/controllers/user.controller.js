import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/apiError.js'
import {User} from '../models/user.models.js'
import {uploadoOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/apiResponse.js";
const generateAccessTokenandRefreshToken = async (userId)=> {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken , refreshToken}

    } catch (error) {
        throw new ApiError(500 , "something went wrong while generating access token")
    }
}
const registerUser = asyncHandler( async (req , res) => {
    // get user detail from frontend 
    // validation  - not empty
    // check if user already exist : username , email 
    // check for images , check for avatar 
    // upload them to cloudinary , avatar 
    // create a user object - create entry in db 
    // remove password and request token field from response
    // check for user creation 
    // return response if not then return error


    const {fullname , email , username , password} = req.body
    console.log(email);
    // if(fullname === ""){
    //     throw new ApiError(400 , "fullname is required , ") 
    // }
    if(
        [fullname,email,username,password].some((field) => field?.trim() ==="")
    ){
        throw new ApiError(400 , "all fields are required  ")
    }
    const existedUser = await  User.findOne({
        $or : [{username} , {email}]
    })
    if(existedUser){
        throw new ApiError(409 , "user already existed")
    }
    const  avatarLocalPath =   req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path; 
    if(!avatarLocalPath) {
        throw new ApiError (400 , "avatar file is required ")
    }

    const avatar = await uploadoOnCloudinary(avatarLocalPath)
    let coverImage = { url: "" };

if (coverImageLocalPath) {
  coverImage = await uploadoOnCloudinary(coverImageLocalPath);
}


    if(!avatar){
        throw new ApiError(400 , "avatar file is required")

    }
    const user = await User.create({
        fullname,
        avatar :avatar.url,
        coverImage : coverImage?.url || "" ,
        email ,
        password ,
        username: username.toLowerCase()

    })

    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500 , "something went wrong while checking the user ")
    }
    return res.status(201).json(
        new ApiResponse(200 ,createdUser , "user registered successfully")
    )
}
)


const loginUser = asyncHandler(async(req,res) => {

    // req body -> data
    // username or email 
    // find the user 
    // passwpord check 
    // generate access token and refresh token
    // send cookies and response that you are login 
    const {email , username,password} =req.body

    if (!username || !email ) {
        throw new ApiError(400 , "username or email is required")
    }

    const user  =await User.findOne({
        $or : [
            {username: username.toLowerCase()},
            {email}
        ]
    })
    if(!user){
        throw new ApiError(401 , "invalid credentials")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401 , "invalid password")
    }
    const {accessToken,refreshToken} = await generateAccessTokenandRefreshToken(user._id)

    const loggedinUser = await User.findById(user._id).select( "-password -refreshToken"  )

    const option = {
        httpOnly: true,
        secure: true,
    }
    return res.status(200).cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken, option).json(
        new ApiResponse(200 ,{user :  loggedinUser , accessToken , refreshToken} , "user login successfully")
    )


})
const logoutUser = asyncHandler(async(req,res) => {

})
export {registerUser,loginUser , logoutUser}