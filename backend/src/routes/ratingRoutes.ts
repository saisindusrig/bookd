import { Router } from "express";

import {
  createRating,
  updateRating,
  deleteRating,
  getMyRatingForBook,
  getBookRatings,
  getMyRatings
} from "../controllers/ratingController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/me", protect, getMyRatings);

router.get("/:bookId", getBookRatings);

router.get("/:bookId/me", protect, getMyRatingForBook);

router.post("/:bookId", protect, createRating);

router.put("/:bookId", protect, updateRating);

router.delete("/:bookId", protect, deleteRating);

export default router;