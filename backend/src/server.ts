import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import {
  connectDB,
} from "./conifg/db";

import authRoutes from "./routes/authRoutes";
import favouriteRoutes from "./routes/favouriteRoutes";
import ratingRoutes from "./routes/ratingRoutes";
import bookRoutes from "./routes/bookRoutes";

dotenv.config();

const app =
  express();

const PORT =
  Number(
    process.env.PORT
  ) || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

/*
|--------------------------------------------------------------------------
| MIDDLEWARE
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin:
      FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get(
  "/api/health",
  (_req, res) => {
    res.status(200).json({
      status: "ok",
      service:
        "BOOKD API",
      timestamp:
        new Date().toISOString(),
    });
  }
);

/*
|--------------------------------------------------------------------------
| API ROUTES
|--------------------------------------------------------------------------
*/

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/favourites",
  favouriteRoutes
);

app.use(
  "/api/ratings",
  ratingRoutes
);

app.use(
  "/api/books",
  bookRoutes
);

/*
|--------------------------------------------------------------------------
| ROOT
|--------------------------------------------------------------------------
*/

app.get(
  "/",
  (_req, res) => {
    res.json({
      message:
        "BOOKD API is running.",
      status: "ok",
    });
  }
);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use(
  (_req, res) => {
    res.status(404).json({
      message:
        "API route not found.",
    });
  }
);

/*
|--------------------------------------------------------------------------
| ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(
      "Unhandled server error:",
      error
    );

    res.status(500).json({
      message:
        "Internal server error.",
    });
  }
);

/*
|--------------------------------------------------------------------------
| DATABASE + SERVER
|--------------------------------------------------------------------------
*/

const startServer =
  async () => {
    try {
      await connectDB();

      app.listen(
        PORT,
        "0.0.0.0",
        () => {
          console.log(
            `BOOKD API running on port ${PORT}`
          );
        }
      );
    } catch (error) {
      console.error(
        "Failed to start BOOKD:",
        error
      );

      process.exit(1);
    }
  };

startServer();