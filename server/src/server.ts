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
import { check_if_liked, count_likes, like_object } from "./schema/queries/likes";

const main = async () => {
  dotenv.config();

  const PORT = process.env.PORT;
  const URI = process.env.URI;

  const app = express();
  app.use(helmet())

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

  app.post("/register", register);
  app.post("/login", login);
  app.post("/add_book", add_book);
  app.get("/fetch_books", fetch_books); 
  app.get("/fetch_book/:title", fetch_book);
  app.post("/add_review", add_review);
  app.get("/fetch_reviews/:id", fetch_reviews);
  app.post("/add_comment", add_comment);
  app.get("/fetch_comments/:id", fetch_comments);
  app.post("/add_reading_status", add_reading_status);
  app.post("/change_status", change_status);
  app.get("/find_status/:id/:book_id", find_status);
  app.post("/delete_review", delete_user_review);
  app.post("/delete_comment", delete_user_comment);
  app.post("/edit_comment", edit_comment);
  app.post("/edit_review", edit_review);
  app.get("/show_finished/:id/:finished", sort_by_finished);
  app.get("/show_stars/:id/:stars", sort_by_stars);
  app.post("/delete_book", delete_book)
  app.post('/add_photo', add_photo)
  app.post('/delete_photo', delete_photo)
  app.post('/edit_field', edit_field)
  app.get('/search/:input', search);
  app.post('/likes/like', like_object);
  app.get('/likes/check/:user_id/:object_id', check_if_liked);
  app.get('/likes/count/:object_id', count_likes);
  app.get('/fetch_by_status/:user_id/:field', fetch_by_reading_status);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
main();
