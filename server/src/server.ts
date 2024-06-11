import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { mongooseConfig } from "./database/mongooseConfig";
import userRouter from "./routes/userRouter";
import bookRouter from "./routes/bookRouter";
import reviewsRouter from "./routes/reviewsRouter";
import commentsRouter from "./routes/commentsRouter";
import likesRouter from "./routes/likesRouter";
import searchRouter from "./routes/searchRouter";
import { helmetConfig } from "./config/helmetConfig";

dotenv.config();

const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ORIGIN || "http://localhost:8080";

const configMiddleware=(app: any)=>{
  app.use(helmetConfig);
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
}

const configRoutes=(app: any)=>{

  app.use(userRouter);
  app.use(bookRouter);
  app.use(reviewsRouter);
  app.use(commentsRouter);
  app.use(searchRouter);
  app.use(likesRouter);

}
const main = async () => {

  const app = express();

  configMiddleware(app);
  configRoutes(app);

  try {
    await mongooseConfig();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1); 
  }
};
main();
