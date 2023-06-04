const jwtToken = require('jsonwebtoken')
const user = require('../models/userModel')

const protect = async (req:any,res:any,next:any)=>{
    let token
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
            // verify token
            const decoded = jwtToken.verify(token,process.env.JWT_SECRET)
            // get user from the token
            req.user = await user.findById(decoded.userId).select('-password')

            next()
        } catch (error) {
           res.status(401).json({error: 'Not authorized, invalid token'})  
        }
    }
    if(!token){
        res.status(401).json({error: 'Not authorized, no token found'})  
    }
}
module.exports= {
    protect
}