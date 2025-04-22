const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
}

export {asyncHandler}


// This code defines an asyncHandler function that wraps asynchronous request handlers in Express.js to simplify error handling.















// using try catch
// const asyncHandler = () => {}
// const asyncHandler = () => {() => {}}
// const asyncHandler = () => async() => {}


// const asyncHandler = (fn) => async(req , res,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success : "false",
//             message : err.message
//         })
//     }
// }

