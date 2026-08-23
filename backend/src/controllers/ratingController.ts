import { Response } from "express";
import Rating from "../models/Rating";
import { AuthRequest } from "../middleware/authMiddleware";

export const createRating = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { bookId } = req.params;
    const { rating, comment } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication Required",
      });
    }

    if (!bookId) {
      return res.status(400).json({
        message: "Book ID is required",
      });
    }

    if (
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (
      typeof comment !== "string" ||
      !comment.trim()
    ) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    const existingRating = await Rating.findOne({
      userId,
      bookId,
    });

    if (existingRating) {
      return res.status(409).json({
        message: "You have already rated this book",
      });
    }

    const newRating = await Rating.create({
      userId,
      bookId,
      rating,
      comment: comment.trim(),
    });

    return res.status(201).json({
      message: "Rating added successfully",
      rating: newRating,
    });
  } catch (error) {
    console.error("Create rating error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const updateRating = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { bookId } = req.params;
    const { rating, comment } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (
      typeof comment !== "string" ||
      !comment.trim()
    ) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    const updatedRating =
      await Rating.findOneAndUpdate(
        {
          userId,
          bookId,
        },
        {
          rating,
          comment: comment.trim(),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedRating) {
      return res.status(404).json({
        message: "Rating not found",
      });
    }

    return res.status(200).json({
      message: "Rating updated successfully",
      rating: updatedRating,
    });
  } catch (error) {
    console.error("Update rating error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const deleteRating = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { bookId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const deletedRating =
      await Rating.findOneAndDelete({
        userId,
        bookId,
      });

    if (!deletedRating) {
      return res.status(404).json({
        message: "Rating not found",
      });
    }

    return res.status(200).json({
      message: "Rating deleted successfully",
    });
  } catch (error) {
    console.error("Delete rating error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getMyRatingForBook = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { bookId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const rating = await Rating.findOne({
      userId,
      bookId,
    });

    return res.status(200).json({
      rating,
    });
  } catch (error) {
    console.error("Get my rating error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/*
  Get all BOOKD ratings for a book.

  Also calculates:
  - average BOOKD rating
  - number of BOOKD ratings
*/
export const getBookRatings = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { bookId } = req.params;

    if (!bookId) {
      return res.status(400).json({
        message: "Book ID is required",
      });
    }

    const ratings = await Rating.find({
      bookId,
    })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    const ratingCount = ratings.length;

    const totalRating = ratings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );

    const bookdRating =
      ratingCount > 0
        ? Number(
            (totalRating / ratingCount).toFixed(1)
          )
        : 0;

    return res.status(200).json({
      ratings,
      bookdRating,
      ratingCount,
    });
  } catch (error) {
    console.error(
      "Get book ratings error:",
      error
    );

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getMyRatings = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const ratings = await Rating.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      ratings,
    });
  } catch (error) {
    console.error(
      "Get my ratings error:",
      error
    );

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};