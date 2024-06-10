import cloudinary from "../../cloudinary/cloudinaryConfig";
import User from "../models/UserModel";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { findUser, loginUser, registerUser } from "../../services/userService";
import logger from "../../config/logger";
import Book from "../models/BookModel";

/* 
POST method. It adds a new user to the database
It takes the user input: username, email, password, avatar
If the requirements of no repeat username/email, it returns the auth token and authenticates the user on the frontend
*/

export const register = async (req: Request, res: Response) => {
  try {
    // Deconstructing the input from the client side
    const { email, username, password, avatar } = req.body;

    // Using a custom service to register the user and get the authentication token;
    const token = await registerUser(username, email, password, avatar);
    return res.status(201).json(token);
  } catch (error) {
    // In case of an error, the image sent to Cloudinary is deleted
    if (req.body && req.body.avatar) {
      await cloudinary.v2.uploader.destroy(req.body.avatar);
    }
    logger.error("Error during registration:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/*
POST method. It checks the frontend input and determines if the user already exists.
Request: the username, password and if the user wishes to be logged in longer
Response: An authentication token.
*/

export const login = async (req: Request, res: Response) => {
  try {
    // Deconstructing the input from the client side
    const { username, password, rememberMe } = req.body;

    const user = await User.findOne({ username }); // checks if the username is in the database

    // Error if the username is wrong.
    if (!user) {
      return res.status(401).json("Invalid credentials");
    }

    // Checks if the password provided is correct, if it matches the hashed password in the database;
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Error if the password is wrong
    if (!passwordMatch) {
      return res.status(401).json("Invalid credentials");
    }

    // Using a custom service to get the authentication token
    const token = await loginUser(user.username, rememberMe);
    return res.status(200).json(token);
  } catch (error) {
    logger.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/*
GET method. It fetches the user from the database by it's user id.
Request: the user id.
Response: all the information that corresponds the looked for user.
*/

export const fetchUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await findUser(id);
    if (!user) {
      logger.error("User not found for ID:", id);
      return res.status(404).json("User not found!");
    }
    logger.info("User fetched successfully:", user);
    return res.status(200).json(user);
  } catch (error) {
    logger.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/*
POST method. Adds a book's ID to one of the three possible shelves: Want to read, Currently reading, Read.
Request: the user ID, the book ID, the status/desired shelf
Response: the name shelf name if the adding of the book was successful
*/
export const addReadingStatus = async (req: Request, res: Response) => {
  const { userId, bookId, status } = req.body;

  try {
    // Using a service to find the user
    const user = await findUser(userId);
    if (!user) {
      logger.error("User not found for ID:", userId);
      return res.status(404).json("User not found!");
    }

    // The shelves in the database
    const updateField: Record<string, string> = {
      "Want to read": "wantToRead",
      Read: "read",
      "Currently reading": "currentlyReading",
    };

    // Updating the user entry in the database by adding the book id to the desired shelf
    await User.updateOne(
      { _id: userId },
      { $addToSet: { [updateField[status as string]]: bookId } }
    );
    logger.info(
      `Book added successfully to the ${status} shelf for user ID: ${userId}`
    );
    return res.status(200).json(status);
  } catch (error) {
    logger.error("Error adding a book to a shelf:", error);
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/*
POST method. It takes the book off of the current shelf and adds it to another.
Request: the user ID, the book ID, the status/desired shelf
Response: the name shelf name if the adding of the book was successful 
*/
export const changeReadingStatus = async (req: any, res: any) => {
  const { userId, bookId, status } = req.body;

  const user = await findUser(userId);
  if (!user) {
    logger.error("User not found for ID:", userId);
    return res.status(404).json("User not found!");
  }

  const validStatuses = ["Currently reading", "Want to read", "Read"];
  type Status = (typeof validStatuses)[number];

  const shelfTransitions: Record<Status, Status[]> = {
    "Currently reading": ["wantToRead", "read"],
    "Want to read": ["currentlyReading", "read"],
    Read: ["wantToRead", "currentlyReading"],
  };

  try {
    const updateStatus = async (from: string, to: string) => {
      await User.findOneAndUpdate(
        { _id: userId, [from]: bookId },
        { $pull: { [from]: bookId }, $addToSet: { [to]: bookId } }
      );
    };

    const transitions = shelfTransitions[status as Status];
    if (!transitions) {
      logger.error(`Invalid transition for status: ${status}`);
      return res.status(400).json({ error: "Invalid transition for status" });
    }

    await Promise.all(transitions.map((to) => updateStatus(to, status)));

    logger.info(
      `Reading status changed successfully to ${status} for user ID: ${userId}`
    );
    return res.status(200).json(status);
  } catch (error) {
    logger.error(
      `Error changing reading status for user ID: ${userId}: ${error}`
    );
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/*
GET method. A method that checks the current user's database entry to find if the book is on one of the three shelves
Request: the user ID and the book ID
Response: the name of the shelf the book is on or "None" if it's not added to any.
*/

export const findReadingStatus = async (req: any, res: any) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  const user = await findUser(userId);
  if (!user) {
    logger.error("User not found for ID:", userId);
    return res.status(404).json("User not found!");
  }
  try {
    const status = user!.fetchReadingStatus(bookId);
    if (!status) {
      return res.status(200).json("None");
    }
    return res.status(200).json(status);
  } catch (error) {
    logger.error(
      `Error while looking for the reading status of the book for the user: ${userId}: ${error}`
    );
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/*
GET method. A method to get all the books on a given shelf.
Request: the user ID and the name of the shelf
Response: The books on the desired shelf.
*/

export const fetchByReadingStatus = async (req: any, res: any) => {
  const userId = req.params.userId;
  const field = req.params.field;
  try {
    const user = await findUser(userId);

    if (!user) {
      logger.error("User not found for ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }
    const userShelf = user[field as keyof User];

    const query = { _id: { $in: userShelf } };
    const result = await Book.find(query);

    logger.info(
      `Fetched books by reading status ${field} for user ID: ${userId}`
    );
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Error fetching books by reading status for user ID: ${userId}: ${error}`);
    return res.status(500).json({ error: `Internal server error: ${error}` });
  }
};
