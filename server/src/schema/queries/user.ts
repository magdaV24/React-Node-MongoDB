import { hash } from "bcryptjs";
import users from "../models/user";
import books from '../models/book'
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const register = async (req: any, res: any) => {
  const {
    email,
    username,
    password,
    avatar,
  } = req.body;

  try {
    const test_email = await users.findOne({ email });
    const test_username = await users.findOne({ username });

    if (test_email) {
      return res.json("The email provided is already in use!");
    }
    if (test_username) {
      return res.json("This username is taken!");
    }
    if (!test_email && !test_username) {
      const hashed: any = (await hash(password, 12)).toString();

      const data = {
        username: username,
        password: hashed,
        email: email,
        avatar: avatar,
        role: "User",
        currently_reading: [],
        want_to_read: [],
        read: [],
      };

      await users.insertMany([data]);

      return res.json("Success!");
    }
  } catch (error) {
    return res.json(`Error: ${error}`);
  }
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  const test = await users.findOne({ email });

  if (!test) {
    return res.json("This email address is not registered!");
  } else {
    const checkPassword = bcrypt.compare(password, test.password);

    if ((await checkPassword).valueOf() === false) {
      return res.json("The password is incorrect!");
    } else {
      const secret = process.env.JWT_SECRET || "jwt_secret";
      const token = jwt.sign(
        {
          id: test._id,
          email: test.email,
        },
        secret,
        { expiresIn: "1h" }
      );
      return res.json({
        id: test._id,
        username: test.username,
        email: test.email,
        avatar: test.avatar,
        currently_reading: test.currently_reading,
        read: test.read,
        want_to_read: test.want_to_read,
        token: token,
        role: test.role,
      });
    }
  }
};

// Adding a book to a reading status list

export const add_reading_status = async (req: any, res: any) => {
  const { id, book_id, status } = req.body;

  const user = await users.findById({_id: id})

  if(!user){
    return res.status(400).json({success: false, message: "User not found!"})
  }

  try {
    if(status === "Want to read"){
     await users.updateOne({_id: id}, {$push: { want_to_read: book_id }})
    } else if(status === "Read"){
      await users.updateOne({_id: id}, {$push: { read: book_id }})
    } else{
      await users.updateOne({_id: id}, {$push: { currently_reading: book_id }})
    }
    return res.json("Success!")
  } catch (error) {
    return res.json(`Error: ${error}`);
  }
}

// Changing the reading status of a book

export const change_status = async (req: any, res: any) => {
  const { id, book_id, status } = req.body;

  if (!id || !book_id || !status) {
    return res.status(400).json({ success: false, message: 'Invalid input' });
  }
  try {
    const updateStatus = async (from: string, to: string) => {
      await users.findOneAndUpdate(
        { _id: id, [from]: { $in: [book_id] } },
        { $pull: { [from]: book_id }, $push: { [to]: book_id } }
      );
    };

    switch (status) {
      case "Currently reading":
        await updateStatus("want_to_read", "currently_reading");
        await updateStatus("read", "currently_reading");
        break;
      case "Want to read":
        await updateStatus("currently_reading", "want_to_read");
        await updateStatus("read", "want_to_read");
        break;
      case "Read":
        await updateStatus("want_to_read", "read");
        await updateStatus("currently_reading", "read");
        break;
      default:
        return res.json({ status: "Error", message: "Unrecognized status" });
    }

    return res.json({ message: "Success" });
  } catch (error) {
    return res.json(`Error: ${error}`);
  }
};

export const find_status = async (req: any, res: any) => {
  const id = req.params.id;
  const book_id = req.params.book_id;
  try {
    const user = await users.findOne({
      _id: id,
    });

    if(!user){
      return res.json("An error occurred while looking for this user!");
    } else{
      const status = user.fetchReadingStatus(book_id);
      return res.json(status);
    }
  } catch (error) {
    return res.json(`Error: ${error}`);
  }
};


//Fetch books by reding status

export const fetch_by_reading_status = async (req: any, res: any) => {
  const user_id = req.params.user_id;
  const field = req.params.field;

  try {
    const user = await users.findOne({_id: new mongoose.Types.ObjectId(user_id)});

    if(!user){
      res.json("User not found!")
    }else{
      let result;

      switch (field) {
        case 'want_to_read':
          result = await books.find({ _id: { $in: user.want_to_read } });
          break;
        case 'currently_reading':
          result = await books.find({ _id: { $in: user.currently_reading } });
          break;
        case 'read':
          result = await books.find({ _id: { $in: user.read } });
          break;
        default:
          return res.json("Invalid field");
      }
  
      return res.json(result);
    }
  } catch (error) {
    return res.json(`Error: ${error}`);
  }
}