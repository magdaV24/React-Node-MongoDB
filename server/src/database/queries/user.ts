import { hash } from "bcryptjs";
import cloudinary from "../../cloudinary/cloudinaryConfig";
import user from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import book from "../models/book";

// Creates a new user entry in the database; if the account is created successfully, it returns an authentication token and logs
// in the new user, with the "Remember me" option false

export const register = async (req: any, res: any) => {
  try {
    const { email, username, password, avatar } = req.body;
    const testEmail = await user.findOne({ email });
    const testUsername = await user.findOne({ username });

    if (testEmail) {
      await cloudinary.v2.uploader.destroy(avatar);
      return res.status(500).json("The email provided is already in use!");
    }
    if (testUsername) {
      await cloudinary.v2.uploader.destroy(avatar);
      return res.status(500).json("This username is taken!");
    }
    if (!testEmail && !testUsername) {
      const hashed: any = (await hash(password, 12)).toString();

      const data = {
        username: username,
        password: hashed,
        email: email,
        avatar: avatar,
        role: "Admin",
        currentlyReading: [],
        wantRoRead: [],
        read: [],
      };

      await user.insertMany([data]);

      const newUser = await user.findOne({ email });
      if (newUser) {
        const secret = process.env.JWT_SECRET || "jwt_secret";
        const token = jwt.sign(
          {
            id: newUser._id,
            email: newUser.email,
            rememberMe: false,
          },
          secret,
          { expiresIn: "5h" }
        );
        return res.status(200).json(token);
      }
    }
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

export const login = async (req: any, res: any) => {
  const { username, password, rememberMe } = req.body;

  const test = await user.findOne({ username });

  if (!test) {
    return res.status(404).json("Username not found!");
  } else {
    bcrypt.compare(password, test.password, (error, data) => {
      if (error) {
        throw error;
      }
      if (data) {
        // Creates a token for the user that will expire in 6 hours;
        const secret = process.env.JWT_SECRET || "jwt_secret";
        const token = jwt.sign(
          {
            id: test._id,
            email: test.email,
            rememberMe: rememberMe,
          },
          secret,
          { expiresIn: "6h" }
        );
        return res.status(200).json(token);
      }
      if (!data) {
        return res.status(500).json("Incorrect password!");
      }
    });
  }
};

export const fetchUser = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    if (!id || id===null) {
      return res.status(200).json(null);
    }
    const currentUser = await user.findOne({ _id: id });
    if (!currentUser) {
      return res.status(404).json("User not found!");
    }
    return res.status(200).json(currentUser);
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

export const addReadingStatus = async (req: any, res: any) => {
  const { userId, bookId, status } = req.body;

  const data = await user.findOne({ _id: userId });

  if (!data) {
    return res.status(404).json("User not found!");
  }

  try {
    if (status === "Want to read") {
      await user.updateOne({ _id: userId }, { $push: { wantToRead: bookId } });
    } else if (status === "Read") {
      await user.updateOne({ _id: userId }, { $push: { read: bookId } });
    } else {
      await user.updateOne(
        { _id: userId },
        { $push: { currentlyReading: bookId } }
      );
    }
    return res.status(200).json(status);
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};
// Changing the reading status of a book

export const changeReadingStatus = async (req: any, res: any) => {
  const { userId, bookId, status } = req.body;

  if (!userId || !bookId || !status) {
    return res.status(404).json("Invalid input");
  }
  try {
    const updateStatus = async (from: string, to: string) => {
      await user.findOneAndUpdate(
        { _id: userId, [from]: { $in: [bookId] } },
        { $pull: { [from]: bookId }, $push: { [to]: bookId } }
      );
    };

    switch (status) {
      case "Currently reading":
        await updateStatus("wantToRead", "currentlyReading");
        await updateStatus("read", "currentlyReading");
        break;
      case "Want to read":
        await updateStatus("currentlyReading", "wantToRead");
        await updateStatus("read", "wantToRead");
        break;
      case "Read":
        await updateStatus("wantToRead", "read");
        await updateStatus("currentlyReading", "read");
        break;
      default:
        return res.status(404).json("Unrecognized status");
    }

    return res.status(200).json(status);
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

export const findReadingStatus = async (req: any, res: any) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  try {
    const data = await user.findOne({
      _id: userId,
    });

    if (!data) {
      return res.status(404).json("User not found!");
    } else {
      const status = data?.fetchReadingStatus(bookId);
      if (!status) {
        return res.status(200).json("None");
      }
      return res.status(200).json(status);
    }
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

export const fetchByReadingStatus = async (req: any, res: any) => {
  const userId = req.params.userId;
  const field = req.params.field;
  if (!userId || userId === null || userId === undefined) {
    return res.status(200).json([]);
  } else
  try {
    const currentUser = await user.findOne({
      _id: userId,
    });

    if (!currentUser) {
      return res.status(404).json("User not found");
    }

    let result;

    switch (field) {
      case "wantToRead":
        result = await book.find({ _id: { $in: currentUser.wantToRead } });
        break;
      case "currentlyReading":
        result = await book.find({
          _id: { $in: currentUser.currentlyReading },
        });
        break;
      case "read":
        result = await book.find({ _id: { $in: currentUser.read } });
        break;
      default:
        return res.status(400).json("Invalid field");
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(200).json([]);
  }
};


