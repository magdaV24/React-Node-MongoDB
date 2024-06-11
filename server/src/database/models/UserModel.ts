import mongoose, { Schema } from "mongoose";

interface User extends Document {
  email: string;
  username: string;
  password: string;
  avatar: string;
  role: string;
  wantToRead: Array<mongoose.Types.ObjectId>;
  currentlyReading: Array<mongoose.Types.ObjectId>;
  read: Array<mongoose.Types.ObjectId>;
  fetchReadingStatus(bookId: string): string | null;
}

const userSchema: Schema<User> = new mongoose.Schema({
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
  wantToRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Books" }],
  currentlyReading: [{ type: mongoose.Schema.Types.ObjectId, ref: "Books" }],
  read: [{ type: mongoose.Schema.Types.ObjectId, ref: "Books" }],
});

userSchema.methods.fetchReadingStatus = function (
  bookId: string
): string | null {
  if (this.wantToRead.includes(bookId)) {
    return "Want to read";
  } else if (this.currentlyReading.includes(bookId)) {
    return "Currently Reading";
  } else if (this.read.includes(bookId)) {
    return "Read";
  } else {
    return "None";
  }
};

const User = mongoose.model<User>("Users", userSchema);

export default User;
