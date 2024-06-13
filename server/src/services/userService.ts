import cloudinary from "cloudinary";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../database/models/UserModel";
import logger from "../config/logger";

export const registerUser = async (
  email: string,
  username: string,
  password: string,
  avatar: string
) => {
  try {
    /*
    First, it checks if any user was registered with either the email or the username provided by the client;
    If there is another user with either of these specific credentials, the photo submitted to Cloudinary is deleted from the 
    project folder and an error is thrown.
    If the credentials are new, the password is hashed and a new user entry is created.
    The user is also logged in, with a value of rememberMe of false.
    */
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      await cloudinary.v2.uploader.destroy(avatar);
      if (existingUser.email === email) {
        throw new Error("The email provided is already in use!");
      }
      if (existingUser.username === username) {
        throw new Error("This username is taken!");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      avatar,
      role: "Admin",
      currentlyReading: [],
      wantToRead: [],
      read: [],
    };

    await User.insertMany(newUser);
    const authToken = await loginUser(newUser.username, false);
    return authToken;
  } catch (error) {
    logger.error("Error during user registration:", error);
    throw new Error("Error while trying to register the user: " + error);
  }
};

export const loginUser = async (username: string, rememberMe: boolean) => {
  try {
    const currentUser = await User.findOne({ username });
    if (!currentUser) {
      throw new Error("User not found!");
    }
    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error("SECRET environment variable is not set");
    }
    const token = jwt.sign(
      {
        id: currentUser._id,
        email: currentUser.email,
        rememberMe: rememberMe,
      },
      secret,
      { expiresIn: "6h" }
    );
    return token;
  } catch (error) {
    logger.error("Error during user login:", error);
    throw new Error("Error logging in the user: " + error);
  }
};

export const findUser = async (id: string) => {
  const user = await User.findOne({
    _id: id,
  });
  return user;
};
