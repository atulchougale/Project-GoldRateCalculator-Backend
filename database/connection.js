import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const db = process.env.MONGO_URI;

async function connect(){
    mongoose.set('strictQuery', true)
   const database= mongoose.connect(db,{ 
            useNewUrlParser: true,
            useUnifiedTopology: true
         })
  console.log('MongoDB connected')
  return database;

}


export default connect;