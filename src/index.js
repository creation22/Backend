// require('dotenv').config({path : './env'})
import dotenv from  "dotenv"

import connectDB from "./db/index.js";

dotenv.config({
    path:"./env"
})

connectDB()



























// // ifees 
// ;(async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error" , (error) => {
//             console.log("Err" , error);
//             throw error
//         })
//         app.listen(process.env.PORT , () => {
//             console.log(  `app is listening on port ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.log("error" , error)
//         throw error
//     }
// })()