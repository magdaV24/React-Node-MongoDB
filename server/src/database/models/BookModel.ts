import mongoose, { Document, Schema } from 'mongoose';

// Define the Review interface
export interface ReviewInterface extends Document {
  userId: string;
  date: string;
  content: string;
  stars: number;
  spoilers: boolean;
  finished: string;
}

// Define the Book interface
export interface BookInterface extends Document {
  title: string;
  author: string;
  published: string;
  description: string;
  genres: string[];
  pages: number;
  language: string;
  photos: string[];
  reviews: ReviewInterface[];
  grade: number[];
}

// Create the Review schema
const reviewSchema = new Schema<ReviewInterface>({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String, required: true },
  stars: { type: Number, required: true },
  spoilers: { type: Boolean, required: true },
  finished: { type: String, required: true }
});

// Create the Book schema
const bookSchema = new Schema<BookInterface>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  published: { type: String, required: true },
  description: { type: String, required: true },
  genres: { type: [String], required: true },
  pages: { type: Number, required: true },
  language: { type: String, required: true },
  photos: { type: [String] , required: true },
  reviews: [reviewSchema],
  grade: { type: [Number], required: true }
});

// Export the Book model
export const Book = mongoose.model<BookInterface>('Book', bookSchema);
