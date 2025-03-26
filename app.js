const express=require("express");
const {connectDB}=require("./dbconnection");
const {auth}=require("./middleware");
const {forgotPassword,verifyOtp}=require("./nodemailer");
const {getApi,getAllUsers,postSignin,postForgotPassword,postSignup,patchUser,deleteUser}=require("./routingHandler");
const app=express();

require('dotenv').config();
const PORT = process.env.PORT || 5000;
// const SECRET_KEY = process.env.SECRET_KEY;
// database connectivity
connectDB();


// middleware
app.use(express.json());


// endpoints
app.get("/user",getApi);
app.get("/user/allusers",auth,getAllUsers);
app.post("/user/signin",postSignin);
app.post("/user/forgotpassword",postForgotPassword,forgotPassword);
app.post("/user/signup",postSignup);
app.post("/user/verifyotp",auth,verifyOtp);
app.patch("/user",auth,patchUser);
app.delete("/user/iddelete/:username",auth,deleteUser);

// server 
app.listen(PORT,()=>{
    console.log("Server is running");
});
