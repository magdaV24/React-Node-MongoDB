import mongoose, { Schema } from "mongoose";
interface User extends Document {
  email: string;
  username: string;
  password: string;
  avatar: string;
  role: string;
  want_to_read: Array<mongoose.Types.ObjectId>;
  currently_reading: Array<mongoose.Types.ObjectId>;
  read: Array<mongoose.Types.ObjectId>;
  fetchReadingStatus(book_id: string): string | null;
}

const user_schema: Schema<User> = new mongoose.Schema({
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
  want_to_read: [{ type: mongoose.Schema.Types.ObjectId, ref: "Books" }],
  currently_reading: [{ type: mongoose.Schema.Types.ObjectId, ref: "Books" }],
  read: [{ type: mongoose.Schema.Types.ObjectId, ref: "Books" }],
});

user_schema.methods.fetchReadingStatus = function (book_id: string): string | null {
  if (this.want_to_read.includes(new mongoose.Types.ObjectId(book_id))) {
    return 'Want to read';
  } else if (this.currently_reading.includes(new mongoose.Types.ObjectId(book_id))) {
    return 'Currently Reading';
  } else if (this.read.includes(new mongoose.Types.ObjectId(book_id))) {
    return 'Read';
  } else {
    return 'None';
  }
};

const users = mongoose.model<User>("Users", user_schema);

export default users;
