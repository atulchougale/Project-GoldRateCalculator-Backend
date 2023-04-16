import UserModel from "../models/User.model.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import dotenv from 'dotenv';
dotenv.config()

const  JWT_SECRET  = process.env.SECRET_KEY


/** middleware for verify user */
export const verifyUser = async(req, res, next)=>{
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}

/** POST: http://localhost:5000/users/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/

export const register = async (req, res) => {
  try {
    const { username, password, email, profile,mobile } = req.body;

    // Check if username already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ error: 'Username already taken' });
    }

    // Check if email already exists
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({ error: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance and save it to the database
    const user = new UserModel({
      username,
      password: hashedPassword,
      email,
      profile: profile || '',
      mobile
    });
    await user.save();

    // Return a success message
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};


/** POST: http://localhost:5000/users/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
 
 export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: 'Username not found' });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).send({ error: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).send({ message: 'Login successful', username: user.username, token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};


/** GET: http://localhost:5000/users/user/example123 */
export const getUser= async(req, res)=> {
    const { username } = req.params;
  
    try {
      if (!username) {
        return res.status(501).send({ error: "Invalid Username" });
      }
  
      const user = await UserModel.findOne({ username });
      if (!user) {
        return res.status(501).send({ error: "Couldn't Find the User" });
      }
  
      // Remove password field from user
      const { password, ...rest } = user.toJSON();
  
      return res.status(201).send(rest);
    } catch (error) {
      return res.status(404).send({ error: "Cannot Find User Data" });
    }
  }
  


/** PUT: http://localhost:5000/users/updateuser   
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export const updateUser = async(req, res)=> {
    try {
      const { userId } = req.user;
        // const id = req.query.id;
      if (!userId) {
        return res.status(401).send({ error: "User Not Found...!" });
      }
  
      const body = req.body;
      await UserModel.updateOne({ _id: userId }, body);
      return res.status(201).send({ message: "Record Updated...!" });
    } catch (error) {
        console.log(error)
      return res.status(401).send({ error });
    }
  }
  
  


/** GET: http://localhost:5000/users/generateOTP */
export const generateOTP =async(req,res)=>{
    try {
        req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
    } catch (error) {
        console.log(error)
    }
}


/** GET: http://localhost:5000/users/verifyOTP */
export const verifyOTP =async(req,res)=>{
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ message: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:5000/user/createResetSession */
export const createResetSession =async(req,res)=>{
  if(req.app.locals.resetSession){
    return res.status(201).send({ flag : req.app.locals.resetSession})
}
return res.status(440).send({error : "Session expired!"})
}


// update the password when we have valid session
/** PUT: http://localhost:5000/users/resetPassword */
export  const resetPassword = async(req, res)=>{
    try {
      if (!req.app.locals.resetSession) {
        return res.status(440).send({ error: "Session expired!" });
      }
  
      const { username, password } = req.body;
  
      try {
        const user = await UserModel.findOne({ username });
  
        if (!user) {
          return res.status(404).send({ error: "Username not found" });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        await UserModel.updateOne(
          { username: user.username },
          { password: hashedPassword }
        );
  
        req.app.locals.resetSession = false; // reset session
  
        return res.status(201).send({ msg: "Record updated...!" });
      } catch (error) {
        return res.status(500).send({ error: "Unable to update password" });
      }
    } catch (error) {
      return res.status(401).send({ error });
    }
  }
  