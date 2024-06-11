import mongoose, { Schema } from "mongoose";

interface Comment extends Document {
  parentId: string;
  bookId: string;
  userId: string;
  date: string;
  content: string;
}
const commentSchema: Schema<Comment> = new mongoose.Schema({
  parentId: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
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
});

const Comment = mongoose.model<Comment>("Comments", commentSchema);

export default Comment;
