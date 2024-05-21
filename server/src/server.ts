import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { mongooseConfig } from "./database/mongooseConfig";
import { addReadingStatus, changeReadingStatus, fetchByReadingStatus, fetchUser, findReadingStatus, login, register } from "./database/queries/user";
import { addBook, addPhoto,  deleteBook, deletePhoto,  editFields, fetchBook, fetchBooks,  search,  } from "./database/queries/book";
import { likeObject, checkIfLiked, countLikes } from "./database/queries/likes";
import { addComment, fetchComments, editComment, deleteComment } from "./database/queries/comment";
import { addReview, fetchReviews, sortFinished, sortStars, editReview, deleteReview } from "./database/queries/review";

const main = async () => {
  dotenv.config();

  const PORT = process.env.PORT;
  const ORIGIN = process.env.ORIGIN

  const app = express();
  app.use(helmet());

  app.use(
    cors({
      origin: function (origin, callback) {
        const allowedOrigins = [ORIGIN, 'http://localhost:3000'];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
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

  app.post("/register", register); // create an account
  app.post("/login", login)
  app.get("/fetchUser/:id?", fetchUser);
  app.post("/addReadingStatus", addReadingStatus);
  app.post("/changeReadingStatus", changeReadingStatus);
  app.get("/findReadingStatus/:userId/:bookId", findReadingStatus);
  app.get('/fetchDrawerBooks/:userId?/:field', fetchByReadingStatus);

  // Book management

  app.post("/addBook", addBook);
  app.get("/fetchBooks", fetchBooks)
  app.get("/fetchBook/:title", fetchBook);
  app.post("/addPhoto", addPhoto);
  app.post('/deletePhoto', deletePhoto);
  app.post('/editFields', editFields);
  app.post('/deleteBook', deleteBook);
  // Reviews management

  app.post("/addReview", addReview);
  app.get("/fetchReviews/:id", fetchReviews) 
  app.get("/sortFinished/:id/:finished", sortFinished); 
  app.get("/sortStars/:id/:stars", sortStars);
  app.post('/editReview', editReview);
  app.post('/editReview', editReview);
  app.post('/deleteReview', deleteReview);

  // Comment Management
  app.post("/addComment", addComment); // adds a new comment;
  app.get("/fetchComments/:id", fetchComments); //fetches the comments by their parent_id;
  app.post("/deleteComment", deleteComment); // deletes the comment;
  app.post("/editComment", editComment); //edits the comment;
  
  // Search functionality
  app.post("/search", search); // searches the books by title or author;

  // Likes Management
  app.post("/like", likeObject); //gives a like to an object (review/comment)
  app.get("/checkIfLiked/:userId/:objectId", checkIfLiked); // checks if the user liked an object and returns a boolean;
  app.get("/countLikes/:objectId", countLikes); // return the umber of likes of a certain object;


  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
main();