import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: {
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


const bookSchema = new mongoose.Schema({
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
  reviews: [reviewSchema],
  grade: {
    type: Array,
    required: true,
  },
});

const book = mongoose.model("Books", bookSchema);

export default book;
