import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required"
      });
    }


    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered"
      });
    }


    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

export const login = async(req: Request, res: Response ) =>{
  try{
    const {email, password} = req.body;

    if(!email || !password){
       return res.status(400).json({
        message: "Email and password are required"
    })
  }
  const user = await User.findOne({email});

  if(!user){
    return res.status(400).json({
      message: "Invalid email or password"
    })
  }
   const isPasswordCorrect = await bcrypt.compare(password , user.password);
   if(!isPasswordCorrect){
    return res.status(401).json({
      message : "Invalid email or password"
    })
   }

   const token = jwt.sign({userId: user._id.toString()},
                          process.env.JWT_SECRET as string,
                          {expiresIn: "7d"})
   return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  }
  catch(error){
    console.error("Login error", error);
    return res.status(500).json({
      message:"Something went wrong"
    })

  }
}
export const getMe = async (
  req: AuthRequest,
  res: Response
)=>{
  try{
    const user = await User.findById(req.userId).select("-password");

    if(!user){
      return res.status(404).json({
        message: "User not found"
      })
    }
    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    })

  }

  catch(error){
    console.error("Get user error",error)
  }
  return res.status(500).json({
    message: "Something went wrong"
  })
}