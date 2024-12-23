import express from 'express';
import {UserModel} from './models'
import { signUpSchema } from './Schema.zod';
import {Schema, z} from 'zod'
import bcrypt from 'bcrypt'
import { dbConnect } from './dbConnect';
import { Keypair } from '@solana/web3.js';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import { JWT_SECRET } from './constants';
import { middleware } from './middleware';
import cookieParser from 'cookie-parser';

export type signUpSchema = z.infer<typeof signUpSchema>
const app = express();

app.use(express.json());
app.use(cookieParser());


app.post('/api/v1/sign-up', async(req,res): Promise<void> =>{

    const result = signUpSchema.safeParse(req.body);

    if(!result.success || !result ){
        res.status(500).json({
            message: "sign up failed",
            error: "validation error: " + result.error
        })
        return;
    }
    const {username , password} = result.data as signUpSchema;

    try {
        const existingUser = await UserModel.findOne({
            username: username
        })
        if(existingUser){
            res.status(401).json({
                message: "User already exists"
            });
            return
        }

        

    } catch (error) {
        res.status(500).json({
            message:"Internal server error "+error

        })
        return
    }
    try {
        const hashedPassword = await bcrypt.hash(password,10);
        const keyPair = new Keypair();

    const user = new UserModel({
        username: username,
        password: hashedPassword,
        publicKey: keyPair.publicKey.toString(),
        privateKey: keyPair.secretKey.toString(),
    })

    await user.save()

    res.json({
        message: "User signed up successfully",
        publicKey: keyPair.publicKey.toString()
    })
    } catch (error) {
        res.status(400).json({
            message: "Failed to sign up",
            error: error
        })
    }
   
})

app.post('/api/v1/sign-in',async(req,res)=>{

    const result = signUpSchema.safeParse(req.body);

    const {username , password} = result.data as signUpSchema;

    try {
      const user = await UserModel.findOne({
            username
        })
        if(!user){
            res.status(404).json({
                message: "User does not exist",
            })
            return;
        }
        const decodedPassword = await bcrypt.compare(password,user?.password)

        if(!decodedPassword){
            res.status(500).json({
                message: "Invalid Credentials"
            })
            return;
        }

        const token = jwt.sign({
            id: (user._id as mongoose.Types.ObjectId).toString()
        },JWT_SECRET,{expiresIn: '1h'})

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            maxAge: 3600000, // 1 hour
        });

        res.status(201).json({
            message: "User signed in successfully",
            token: token
        })

    } catch (error) {
        res.status(400).json({
            message:"user sign in failed",
            error: error
        })
    }
    
    res.json({
        message: "User signed in successfully"
    })
})

app.post('/api/v1/txn/sign',(req,res)=>{

    const {username ,password} = req.body;

    res.json({
        message: "User signed in successfully"
    })
})

app.get('/api/v1/txn',middleware,(req,res)=>{

   

    res.json({
        message: "User signed in successfully"
    })
})

async function main():Promise<void>{
console.log("connecting to the database....");
await dbConnect();
app.listen(3000,()=>{
    console.log("server listening on port 3000..")
    
})
}

main();