// const express = require("express");
const nodemailer = require("nodemailer");
// const twilio=require("twilio");
// const otpgenerator=require("otp-generator");
const { token } = require("./autherization");

const {OtpSchema}=require("./dbconnection");
require('dotenv').config();

// Sending Route verification using nodemailer
const forgotPassword= async (req, res) => {
    const body= req.body;
    // const otp=otpgenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        // 1. Create a Transporter
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.adminMail, // Replace with your Gmail
                pass: process.env.adminPassword // Replace with your Gmail password or App Password
            }
        });

        // 2. Define Mail Options
        let mailOptions = {
            from: process.env.adminMail, // Sender Email
            to:body.email, // Receiver Email
            subject: "mail for reset password", // Email Subject
            text: `verification code ${otp}` // Email Body (Plain Text)
        };
        // checking already exisit in database
        const data =await OtpSchema.find({email:body.email});
        if(data.length==0){
            const result=await OtpSchema.create({
                        email:body.email,
                        otp:otp
            });
            console.log(result);
        }
        else{
            const updatedUser = await OtpSchema.findOneAndUpdate(
                { email:body.email }, // Find user by username
                { otp:body.otp }, // Update only provided fields
                { new: true, runValidators: true }
            );
            console.log(updatedUser);
        }
        // 3. Send Email
        let info = await transporter.sendMail(mailOptions);
        console.log("Email Sent: " + info.response);
        const Token=token(body.email);
        return res.status(200).json({ message: "Email sent successfully!","access token":Token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to send email" });
    }
}

const verifyOtp=async(req,res)=>{
    const body=req.body;
    try{
        const data=await OtpSchema.find({email:body.email});
        if(body.otp!=data[0].otp){
            return res.status(400).json({message:"INVALID OTP"})
        }
        else{
            const Token=token(data[0].email);
            return res.status(400).json({msg:"verifed","token":Token});
        }
    }
    catch(error){
        console.error(error);
        res.status(400).json({msg:error});
    }
}
// using twilio service by twilio number 
// const forgotPassword1=async(req,res)=>{
//     const accountSid="AC02453baf2e82ca8053c1cd1a0a8fcc80";
//     const authToken="03cebf9f7e02bd0daae3f9295826d1d5";
//     const client=new twilio(accountSid,authToken);

//     client.messages.create({
//         body:"otp verification code 12344",
//         from:"+1 251 351 7659",
//         to:"+918090064743"
//         // to:"+917268034706"
//     }).then((messages)=>{
//         console.log("message sent " + messages.sid);
//     }).catch((error)=>{
//         console.error(error);
//     });
// }

module.exports={
    forgotPassword,
    // forgotPassword1,
    verifyOtp
}

