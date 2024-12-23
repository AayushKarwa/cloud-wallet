import mongoose, {Schema, Document, Model} from 'mongoose';

interface User extends Document{
    username: string,
    password: string,
    privateKey: string,
    publicKey: string,
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,

    },
    privateKey:{
        type: String,
        required: true,

    },

    publicKey:{
        type: String,
        required: true,
    }
})

 const UserModel: Model<User>= mongoose.model<User>("users",UserSchema)

export {UserModel}