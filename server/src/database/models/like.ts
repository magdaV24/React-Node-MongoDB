import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
    },
    objectId: {
      type: String,
      required: true,
    },
    bookId: {
      type: String,
      required: true,
    },
  });

  const likes = mongoose.model("Likes", likeSchema);

  export default likes;