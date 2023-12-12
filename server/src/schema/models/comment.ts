import mongoose from "mongoose";

const comment_schema = new mongoose.Schema();
const like_schema = new mongoose.Schema({
  user_id: {
      type: String,
      required: true
  },
})

comment_schema.add({
  parent_id: {
    type: String,
    required: true,
  },
  book_id: {
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
  user_id: {
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
  likes: [like_schema]
});

const comments = mongoose.model("Comments", comment_schema);

export default comments;
