
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function authMiddleware(req, res, next) {
    
    // Taking the Token
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized or Token Missing"
        });
    }
    
    const token = authHeader.split(" ")[1];

    // For verifying the Token
    try{
        const payload = jwt.verify(token, JWT_SECRET);
        // const user = await User.findById(payload.id).select("-password"); // Select all Excluding the PassWord
        
        req.user = { id: payload.id }; // For handling Multiple request this will help when we give multiple requests
        
        next();

    } catch(err) {
        console.error("JWT Authentication Failed: ", err);
        return res.status(401).json({
            success: false,
            message: "Token invalid or expired!"
        });
    }
}