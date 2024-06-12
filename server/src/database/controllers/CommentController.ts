import { Request, Response } from "express";
import Comment from "../models/CommentModel";
import User from "../models/UserModel";
import logger from "../../config/logger";

/** 
 * POST method. Adds a new comment to the database when the validation rules are met.
 * Request: the input from the client side
 * Response: a message that indicates whether or not the comment has been added to the database.
 */


export const addComment = async (req: Request, res: Response): Promise<Response> => {
  const { parentId, userId, bookId, content, date } = req.body; // deconstructing the client's input 

  try {
    // adding the comment to the database
    await Comment.insertMany([
      {
        parentId: parentId,
        userId: userId,
        bookId: bookId,
        content: content,
        date: date,
      },
    ]);
    logger.info("Comment has been added.")
    return res.status(200).json("Comment added to the database successfully");
  } catch (error) {
    logger.error("Comment couldn't have been added to the database.")
     return res
      .status(500)
      .json(`Internal server error: ${error}`);
  }
};

/** 
 * GET method. Fetches all the children comments of a review or other comment.
 * Request: the parent ID
 * Response: the list of comments left under the parent 
 */

export const fetchComments = async (req: Request, res: Response): Promise<Response>  => {
  const parentId = req.params.id;

  try {
    const parent = await Comment.find({ parentId: parentId });
    const commentList = await Promise.all(
      parent.map(async (comment: any) =>{
        const userId = comment.userId;
        const writer = await User.findOne({_id: userId}).lean();
        if(!writer){
          return { ...comment.toObject(), avatar: null, username: '[deleted]'};
        }
        return {
          ...comment.toObject(),
          avatar: writer.avatar,
          username: writer.username,
        }
      })
    );
    return res.status(200).json(commentList);
  } catch (error) {
   return res
      .status(500)
      .json(`Internal server error: ${error}`);;
  }
};

// Deleting a user's comment

export const deleteComment = async (req: any, res: any) => {
  const id  = req.body.id;

  try {
    await Comment.deleteMany({ parentId: id });
    await Comment.deleteOne({ _id: id });
    return res.status(200).json("Comment deleted successfully");
  } catch (error) {
   return res
      .status(500)
      .json(`Internal server error: ${error}`);;
  }
};

//Edit comment

export const editComment = async (req: any, res: any) => {
  const { id, content } = req.body;

  try {
    await Comment.updateOne({ _id: id }, { $set: { content: content } });
    return res.status(200).json("Comment edited successfully!");
  } catch (error) {
   return res
      .status(500)
      .json(`Internal server error: ${error}`);;
  }
};
