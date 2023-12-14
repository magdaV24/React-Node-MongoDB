import mongoose from "mongoose";

const likes_schema = new mongoose.Schema({
    user_id: {
      type: String,
      required: true,
    },
    object_id: {
      type: String,
      required: true,
    },
    book_id: {
      type: String,
      required: true,
    },
  });

  const likes = mongoose.model("Likes", likes_schema);

  export default likes;