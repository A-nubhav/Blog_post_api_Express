const nodemailer = require("nodemailer");

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

module.exports={
    forgotPassword,
    // forgotPassword1,
    verifyOtp
}

