import crypto from "node:crypto";
import  {jwt} from "jsonwebtoken";

const generateTokens = () => {
    const token =  crypto.randomBytes(32).toString("hex");
    
    const hashToken= crypto.createHash("sha256").update(token).digest("hex");

    return {token,hashToken}
}


const genrateAccessToken=(user:{id:string})=>{
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET as string,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}

const verifyAccessToken=(token:string)=>{
    return jwt.verify(token,process.env.ACCESS_TOKEN_SECRET as string)
}

const genrateRefreshToken=(user:{id:string})=>{
    return jwt.sign(user,process.env.RFERSH_TOKEN_SECRET as string,{expiresIn:process.env.RFERSH_TOKEN_EXPIRY})
}

const verifyRefreshToken=(token:string)=>{
    return jwt.verify(token,process.env.RFERSH_TOKEN_SECRET as string)
}



export {
    generateTokens,
    genrateAccessToken,
    verifyAccessToken,
    genrateRefreshToken,
    verifyRefreshToken,
}