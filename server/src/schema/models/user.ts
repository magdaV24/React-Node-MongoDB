import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    want_to_read: {
      type: Array,
      required: true,
    },
    currently_reading: {
      type: Array,
      required: true,
    },
    read: {
      type: Array,
      required: true,
    },
  });

  const users = mongoose.model("Users", user_schema);

  export default users;