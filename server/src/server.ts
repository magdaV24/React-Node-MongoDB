import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import {
  add_reading_status,
  change_status,
  fetch_by_reading_status,
  find_status,
  login,
  register,
} from "./schema/queries/user";
import {
  add_book,
  fetch_book,
  fetch_books,
  fetch_reviews,
  add_review,
  delete_user_review,
  edit_review,
  sort_by_finished,
  sort_by_stars,
  delete_book,
  add_photo,
  delete_photo,
  edit_field,
  search,
} from "./schema/queries/book";
import {
  add_comment,
  delete_user_comment,
  edit_comment,
  fetch_comments,
} from "./schema/queries/comment";
import { mongooseConfig } from "./schema/mongooseConfig";
import helmet from "helmet";
import {
  check_if_liked,
  count_likes,
  like_object,
} from "./schema/queries/likes";

const main = async () => {
  dotenv.config();

  const PORT = process.env.PORT;
  const URI = process.env.URI;

  const app = express();
  app.use(helmet());

  app.use(
    cors({
      origin: "*",
      methods: ["POST", "GET"],
      credentials: true,
    })
  );

  app.use(express.json());

  //Connecting to MongoDB

  await mongooseConfig();

  // User Management
  app.post("/register", register); // create an account
  app.post("/login", login); // authentication

  app.post("/add_reading_status", add_reading_status); // adds the book's id in the three possible reading statuses the user model has;
  app.post("/change_status", change_status); //changes the reading status of a book in the user's field;
  app.get("/find_status/:id/:book_id", find_status); // returns the user's reading status of the book the user is visiting;
  app.get("/fetch_by_status/:user_id/:field", fetch_by_reading_status); //fetches the books that have their ids in a certain reading status field;

  // Books Management
  app.post("/add_book", add_book); // adds a book to MongoDB;
  app.get("/fetch_books", fetch_books); // fetches all the books from MongoDB;
  app.get("/fetch_book/:title", fetch_book); // fetches the book that's page the user wants to visit;
  app.post("/delete_book", delete_book); //deletes the book;
  app.post("/add_photo", add_photo); //adds a new photo to the book;
  app.post("/delete_photo", delete_photo); //deletes a book's photo;
  app.post("/edit_field", edit_field); // edits a book's field;

  // Reviews Management
  app.post("/add_review", add_review); // adds a review;
  app.get("/fetch_reviews/:id", fetch_reviews); //fetches all the reviews of a book;
  app.post("/delete_review", delete_user_review); // deletes the user's review;
  app.get("/show_finished/:id/:finished", sort_by_finished); // fetches the reviews by their finished status;
  app.get("/show_stars/:id/:stars", sort_by_stars); // fetches the reviews that have a certain grade;
  app.post("/edit_review", edit_review); //edits the user's review;

  // Comment Management
  app.post("/add_comment", add_comment); // adds a new comment;
  app.get("/fetch_comments/:id", fetch_comments); //fetches the comments by their parent_id;
  app.post("/delete_comment", delete_user_comment); // deletes the comment;
  app.post("/edit_comment", edit_comment); //edits the comment;

  // Search functionality
  app.get("/search/:input", search); // searches the books by title or author;

  // Likes Management
  app.post("/likes/like", like_object); //gives a like to an object (review/comment)
  app.get("/likes/check/:user_id/:object_id", check_if_liked); // checks if the user liked an object and returns a boolean;
  app.get("/likes/count/:object_id", count_likes); // return the umber of likes of a certain object;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
main();