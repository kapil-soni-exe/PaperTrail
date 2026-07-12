import mongoose, { Document } from "mongoose";
import { IUser } from "@/types/user.types";
import bcrypt from "bcrypt"

interface UserDocument extends Omit<IUser,"_id">, Document{
    comparePassword(candidatePassword:string):boolean
}

const userSchema = new mongoose.Schema<UserDocument>({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    mobile:{
        type:String,
        unique:true,
        minlength:[10,"Mobile number must be at least 10 characters long"],
        maxlength:[10,"Mobile number must be at most 10 characters long"]
    },
    password:{
        type:String,
        required:true,
        minlength:[6,"Password must be at least 6 characters long"],
        
    },

},{timestamps:true})


userSchema.pre("save",function(){
  if(!this.isModified("password")) return
  this.password =bcrypt.hashSync(this.password,10)
})

userSchema.methods.comparePassword = function(candidatePassword:string):boolean{
  return bcrypt.compareSync(candidatePassword,this.password)
}

const UserModel = mongoose.models.user  || mongoose.model<UserDocument>("user", userSchema);
export default UserModel;
