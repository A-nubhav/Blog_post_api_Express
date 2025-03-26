const {verifyJwt,checkRole}=require("./autherization");


const auth=(req,res,next)=>{
    let body;
    if(Object.keys(req.query).length === 0){
        body=req.body;
    }
    else{
        body =req.query;
    }
    console.log(body);
    if(!body.username){
        return res.status(401).json({message:"pls pass username "});
    }
    const Token=req.headers['authorization'];
    // console.log(Token);
    if(!Token){
        return  res.status(401).json({message:"PLS pass token"});
    }
    try{ 
        const decoded = verifyJwt(Token);
        //  console.log(decoded);
        // console.log("hii");
        // next();
        if(decoded.error){
            // console.log("wdfgh");
            return res.status(402).json({message:"Invalid User"});
        }
        else{
            next();
        }   
    }
    catch(error){
        return res.status(403).json({message:"error"});
    }
    // console.log("Decoded Token:", decoded);
    
};


module.exports={
    auth
}