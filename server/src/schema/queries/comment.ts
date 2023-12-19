import mongoose from "mongoose";
import comments from "../models/comment";

//Add a comment;

export const add_comment = async (req: any, res: any) => {
  const { parent_id, user_id, book_id, content, date, username, avatar } = req.body;

  try {
    await comments.insertMany([
      {
        parent_id: parent_id,
        user_id: user_id,
        book_id: book_id,
        content: content,
        date: date,
        username: username,
        avatar: avatar
      },
    ]);
    return res.json("Success!");
  } catch (error) {
      return res.json(`Error: ${error}`)
  }
};

//Fetch comments by parent_id;

export const fetch_comments = async (req: any, res: any) => {
  const parent_id = req.params.id;

  try {
    const result = await comments.find({ parent_id: parent_id });
    return res.json(result);
  } catch (error) {
    return res.json(`Error: ${error}`);
  }
};

// Deleting a user's comment

export const delete_user_comment = async (req: any, res: any) => {
  const id  = req.body.id;

  try {
    await comments.deleteMany({ parent_id: id });
    await comments.deleteOne({ _id: id });
    return res.json("Success!");
  } catch (error) {
    return res.json(`Error: ${error}`);
  }
};

//Edit comment

export const edit_comment = async (req: any, res: any) => {
  const { id, content } = req.body;

  try {
    await comments.updateOne({ _id: id }, { $set: { content: content } });
    return res.json("Success!");
  } catch (error) {
    return res.json(`Error: ${error}`);
  }
};
