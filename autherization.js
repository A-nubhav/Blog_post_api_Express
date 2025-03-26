const jwt = require("jsonwebtoken");
const {User}=require("./dbconnection");
require('dotenv').config();

const secret_key=process.env.SECRET_KEY;;
// Generate JWT token
const token = (username,time) => {
    return jwt.sign({ username: username }, secret_key, { expiresIn: time||"1h" });
};

// Verify JWT token
const verifyJwt = (token) => {
    try {
        // return jwt.verify(token, secret_key);
        return jwt.verify(token.replace('Bearer ', ''), secret_key);
    } catch (error) {
        return { error: "Invalid or expired token" };
    }
};

// Using RBAC

const checkRole=async(req,res,next)=>{
    // check role from database
    // fetching password from db
    let body;
    if(req.query){
        body=req.query;
    }
    else{
        body =req.body;
    }
    // console.log(body);
    const myrole= await User.find({username:body.username});
    // console.log(myrole);
    // console.log(body);
    if(body.role==myrole[0].role){
        next();
    }
    else{
        return res.status(403).json({message:"access denied"});
    }
}

module.exports = { token, verifyJwt ,checkRole};
