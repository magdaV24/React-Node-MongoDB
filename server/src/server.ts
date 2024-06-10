import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { mongooseConfig } from "./database/mongooseConfig";
import userRouter from "./routes/userRouter";
import bookRouter from "./routes/bookRouter";
import reviewsRouter from "./routes/reviewsRouter";
import commentsRouter from "./routes/commentsRouter";
import likesRouter from "./routes/likesRouter";
import searchRouter from "./routes/searchRouter";

const main = async () => {
  dotenv.config();

  const PORT = process.env.PORT;
  const ORIGIN = process.env.ORIGIN;

  const app = express();
  app.use(helmet());

  app.use(
    cors({
      origin: function (origin, callback) {
        const allowedOrigins = [ORIGIN, "http://localhost:3000"];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["POST", "GET", "DELETE"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 3600,
    })
  );

  app.use(express.json());

  //Connecting to MongoDB

  await mongooseConfig();

  // User management

  app.use(userRouter);

  // Book management

  app.use(bookRouter);
  // Reviews management

  app.use(reviewsRouter);

  // Comment Management
  app.use(commentsRouter);

  // Search functionality
  app.use(searchRouter);

  // Likes Management
  app.use(likesRouter);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
main();
