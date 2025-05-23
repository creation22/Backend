import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name :process.env.CLOUDINARY_CLOUD_NAME ,
    api_key :process.env.CLOUDINARY_API_KEY ,
    api_secret :process.env.CLOUDINARY_API_SECRET
})


const uploadoOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null ; 
        // upload the file on cloudinary 
         const response = await cloudinary.uploader.upload(localFilePath,{resource_type : "auto"})
        // file has been uploaded successfully 
        // console.log("file is uploaded on cloudinary ");
        // console.log(response.url);
        fs.unlink(localFilePath)// remove the locally saved temporary file as the upload operation was successful
        // console.log("file is deleted from local storage ");
        return response
        
        
    } catch (error) {
        fs.unlinkSync(localFilePath)// remove the locally saved temporary file as the upload operation failed 
        return null ; 

    }
}


export {uploadoOnCloudinary}