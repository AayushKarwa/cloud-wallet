import {config} from 'dotenv'
config();
import mongoose from "mongoose";

export async function dbConnect():Promise<void>{

    try {
    console.log("MONGO URI: "+process.env.MONGO_URI)
     const db = await mongoose.connect(process.env.MONGO_URI || '',{})
     console.log('db connected successfully')

    } catch (error) {
        console.log("Database Connection Failed ", error)
        process.exit(1);
    };
}