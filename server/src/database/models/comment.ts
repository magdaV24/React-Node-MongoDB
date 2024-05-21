import mongoose from "mongoose";

const commentSchema = new mongoose.Schema();

commentSchema.add({
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

const comment = mongoose.model("Comments", commentSchema);

export default comment;
