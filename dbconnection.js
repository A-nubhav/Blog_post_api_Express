const mongoose=require("mongoose");
require("dotenv").config();

// database connectivity
// mongoose.connect('mongodb://127.0.0.1:27017/blog-post-api')
// .then(()=>console.log("mongodb connected"))
// .catch((err)=> console.log("mongo err ",err));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(" MongoDB Connection Error:", error);

        process.exit(1); // Stop server if DB fails to connect
    }
};

// declaring schema

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    phone:{
        type:String,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    bio:{
        type:String,
    },
    age:{
         type:Number,
         required:true,
    },
    post:{
        type:String,
        requried:true,
    },
    noOfPost:{
        type:Number||0,
        
    },
    gender:{
        type:String,
    },
});

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    otp:{
        type:Number,
        required:true,
    }
})
const User =mongoose.model("user",userSchema);
const OtpSchema =mongoose.model("otp",otpSchema);

module.exports={
    User,
    OtpSchema,
    connectDB
}