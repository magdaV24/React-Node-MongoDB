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
        avatar: avatar,
        likes: 0
      },
    ]);
    return res.json("Success!");
  } catch (error) {
      return res.json(`Error: ${error}`)
  }
};

// Like a comment

export const like_comment = async (req: any, res: any) => {
  const { object_id, user_id } = req.body

  try {
    const comment = await comments.findOne({ _id: new mongoose.Types.ObjectId(object_id), 'likes.user_id': user_id})
    if(!comment){
      await comments.updateOne({_id: new mongoose.Types.ObjectId(object_id)}, { $push: { likes: user_id } })
    }
    await comments.updateOne({_id: new mongoose.Types.ObjectId(object_id)}, { $pull: { likes: user_id } })

  } catch (error) {
    return res.json(`Error: ${error}`)
  }
}

// Check if the user liked the comment

export const check_liked_comment = async (req: any, res: any) => {
  const object_id = req.params.object_id
  const user_id = req.params.user_id

  try {
    const liked = await comments.findOne({ _id: new mongoose.Types.ObjectId(object_id), 'likes.user_id': user_id})
    if(!liked){
      return false
    }
    return true

  } catch (error) {
    return res.json(`Error: ${error}`)
  }
}

// Count the likes

export const count_comment_likes = async (req: any, res: any) => {
  const object_id = req.params.object_id;

  try {
    const result = await comments.findOne({ _id: new mongoose.Types.ObjectId(object_id) });
    if (!result) {
      return res.json('Cannot find this comment!');
    }
    return res.json(result.likes.length);
  } catch (error) {
    return res.json(`Error: ${error}`);
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
  const { id } = req.body;

  try {
    await comments.deleteMany({ parent_id: id });
    await comments.deleteOne({ _id: id });
    return res.json("Success");
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
