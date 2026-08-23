import { Router } from "express";
import { getBook, getBooksByIds, searchBooks } from "../controllers/bookController.js";

const router = Router();

router.get("/", searchBooks);
router.get("/batch", getBooksByIds);
router.get("/:bookId", getBook);

export default router;
