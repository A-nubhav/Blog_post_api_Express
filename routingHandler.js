const {User}=require("./dbconnection");
// const {auth}=require("./middleware");
const  {hashPassword,verify}=require("./authentication");
const {token}=require("./autherization");
// const nodemailer = require("nodemailer");


const getApi=async(req,res)=>{
    return res.status(200).json({"message":"hii this is login page"});
}
const getAllUsers=async(req,res)=>{
    // console.log("hi");
    const data=await User.find({});
    return res.status(200).json({message:data});
}

const postSignin=async(req,res)=>{
    const body=req.body;
    if(!body || !body.username||!body.password){
        return res.status(400).json({msg:"all fields are req.."});
    }
    // fetching password from db
    const myPassword=await User.find({username:body.username});
    if(myPassword.length===0){
        return res.status(401).json({msg:"username does not exits"});
    }
    // console.log(myPassword);
 
    // verifying password
    const isMatch = await verify(body.password, myPassword[0].password);
    console.log("Password Match:", isMatch);
    if (!isMatch) {
        return res.status(401).json({ msg: "Invalid credentials" });
    }
    // gereating JWT tokens
    const Token=token(body.username);
    console.log(Token);
    return res.status(200).json({ message: "User verified","token":Token });
}

const postForgotPassword=async(req,res,next)=>{
    console.log("hii");
   const body=req.body;
   if(!body||!body.username||!body.email){
      return res.status(400).json({msg:"pls provide username and email"});
   }
   const myPassword=await User.find({username:body.username});
   console.log(myPassword);
   console.log(body.email);
    if(myPassword.length===0){
        return res.status(401).json({msg:"username does not exits"});
    }
    else if(myPassword[0].email!=body.email){
        return res.status(401).json({msg:"Invalid email"});
    }
    else{
        next();
    }
     
}
const postSignup=async(req,res)=>{
    const body=req.body;
    if(!body || !body.username||!body.password){
        return res.status(400).json({msg:"all fields are req.."});
    }
    // generation hashcode of password
    const hashedPassword = await hashPassword(body.password);

    // console.log("Hashed Password:", hashedPassword);

    // inserting into database
    const result=await User.create({
        role:body.role,
        username:body.username,
        password:hashedPassword,
        firstName:body.firstName,
        lastName:body.lastName,
        phone:body.phone,
        email:body.email,
        bio:body.bio,
        age:body.age,
        post:body.post,
        noOfPost:1,
        gender:body.gender
    });
    console.log(result);
    return  res.status(201).json({msg:"siged up successfully"});
}

const patchUser=async(req,res)=>{
    const body=req.body;
    body.password=await hashPassword(body.password);
    console.log(body);
    const updatedUser = await User.findOneAndUpdate(
        { username: req.body.username }, // Find user by username
        { $set: req.body }, // Update only provided fields
        { new: true, runValidators: true }
    );
    res.status(200).json({message:"done successfully","updated data":updatedUser});
}
const deleteUser=async(req,res)=>{
    const firstN=req.params.username;
    const result=await User.deleteOne({ username: firstN });
    console.log(firstN);
    console.log(result);
    return res.status(200).json({"message":"deleted successfully"});
}

module.exports={
    getApi,
    getAllUsers,
    postSignin,
    postForgotPassword,
    patchUser,
    postSignup,
    deleteUser
}

