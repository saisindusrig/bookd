import {Request,Response, NextFunction} from "express";
import jwt from "jsonwebtoken"
interface JwtPayload{
    userId:string;
}
export interface AuthRequest extends Request{
    userId? : string;
     
  params: {
    bookId?: string;
  };
}
export const protect = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) =>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader|| !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                message: "Authentication Required"
            })
        }
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload
    
    req.userId = decoded.userId;
    next();
}
    catch(error){
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }

}