import mongoose from "mongoose";

const review_schema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    required: true,
  },
  spoilers: {
    type: Boolean,
    required: true,
  },
  finished: {
    type: String,
    required: true,
  }
});


const book_schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  published: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  genres: {
    type: Array,
    required: true,
  },
  pages: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  photos: { type: Object, link: Array, required: true },
  reviews: [review_schema],
  grade: {
    type: Array,
    required: true,
  },
  reviews_ids: {
    type: Array,
    required: true,
  },
});

const books = mongoose.model("Books", book_schema);

export default books;
