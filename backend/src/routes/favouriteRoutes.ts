import {Router} from "express";
import { addFavourite, removeFavourite, getMyFavourites, checkFavourite } from "../controllers/favouriteController";
import { protect } from "../middleware/authMiddleware";

const router = Router();
router.get("/",protect,getMyFavourites)
router.get("/", protect, checkFavourite)
router.post("/:bookId", protect, addFavourite)
router.delete("/:bookId", protect, removeFavourite);
export default router;