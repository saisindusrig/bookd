import { Response, Request } from "express";
import Favourite from "../models/Favourite";
import { AuthRequest } from "../middleware/authMiddleware";

export const addFavourite = async(
    req: AuthRequest,
    res: Response
)=>{
    try{
        
        const userId = req.userId;
        const bookId = req.params.bookId
        if(!userId){
            return res.status(401).json({
                message:"authentication required"
            })
        }
        
        if(!bookId){
            return res.status(400).json({
                message:"book ID is required"
            })
        }
        const existingFavourite = await Favourite.findOne({
            userId, bookId
        })
        if(existingFavourite){
            return res.status(409).json({
                message: "Book is already in favourites"
            })
        }
        const favourite = await Favourite.create({userId, bookId});
        return res.status(201).json({
            message: "book added to favourites",
            favourite
        })


    }
    catch(error){
        console.error("add favourite error: ", error);
        return res.status(500).json({
            message:"something went wrong"
        })

    }
}
export const removeFavourite = async(req:AuthRequest, res: Response)=>{
    try{
        const bookId = req.params.bookId;
        const userId = req.userId;
        if(!userId){
            return res.status(401).json({
                message:"Authentication Required"
            })
        }
        const favourite = await Favourite.findOneAndDelete({
            userId,bookId
        });
        if(!favourite){
            return res.status(404).json({
            message: "Favourite not found"
            })
        }
        return res.status(200).json({
            message:"Book removed from favourites"
        })

    }catch(error){
        console.error("removed from favourites error: ", error)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}
export const getMyFavourites = async(req:AuthRequest, res: Response)=>{
    const userId = req.userId
    try{
        if(!userId){
            return res.status(401).json({
                message: "Authentication required"
            })
        }
        const favourites = await Favourite.find({
            userId
        }).sort({createdAt: -1})
        return res.status(200).json({
            favourites
        });

    }catch(error){
        console.error("Get favourites error:", error)
        return res.status(500).json({
        message: "Something went wrong"
    })
    }
}
export const checkFavourite = async(req:AuthRequest, res:Response)=>{
    try{
       const bookId= req.params.bookId;
       const userId = req.userId
        if (!userId) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const favourite = await Favourite.findOne({
      userId,
      bookId
    });

    return res.status(200).json({
      isFavourite: !!favourite
    });
  } catch (error) {
    console.error("Check favourite error:", error);

    return res.status(500).json({
      message: "Something went wrong"
    });
    }
}
