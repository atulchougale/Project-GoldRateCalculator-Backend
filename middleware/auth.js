import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config()
const JWT_SECRET = process.env.SECRET_KEY
/**auth middleware */
 const Auth = async(req,res,next)=>{
    try {
        // access authorize header to validate request
        const token = req.headers.authorization.split(" ")[1];
        
        // retrive the user detailsfor hte logged in user
        const decodedToken = await jwt.verify(token,JWT_SECRET);
        req.user =decodedToken;

        next()
    } catch (error) {
        req.status(401).json({error:"Authemtication Failed"})
    }
}


export default Auth ;

export  function localVariable(req,res,next){
    req.app.locals ={
        OTP:null,
        resetSession :false
    }
    next()
}