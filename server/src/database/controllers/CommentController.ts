import { Request, Response } from "express";
import Comment from "../models/CommentModel";
import User from "../models/UserModel";
import logger from "../../config/logger";
import Like from "../models/LikeModel";

/**
 * POST method. Adds a new comment to the database when the validation rules are met.
 * Request: the input from the client side
 * Response: a message that indicates whether or not the comment has been added to the database.
 */

export const addComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { parentId, userId, bookId, content, date } = req.body;

  try {
    await Comment.insertMany([
      {
        parentId: parentId,
        userId: userId,
        bookId: bookId,
        content: content,
        date: date,
      },
    ]);
    logger.info("Comment has been added.");
    return res.status(200).json("Comment added to the database successfully");
  } catch (error) {
    logger.error("Comment couldn't have been added to the database.");
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/**
 * GET method. Fetches all the children comments of a review or other comment.
 * Request: the parent ID
 * Response: the list of comments left under the parent
 */

export const fetchComments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const parentId = req.params.id;

  try {
    const comments = await Comment.find({ parentId: parentId });
    const commentList = await Promise.all(
      comments.map(async (comment: any) => {
        const userId = comment.userId;
        const writer = await User.findOne({ _id: userId }).lean();
        if (!writer) {
          return { ...comment.toObject(), avatar: null, username: "[deleted]" };
        }
        return {
          ...comment.toObject(),
          avatar: writer.avatar,
          username: writer.username,
        };
      })
    );
    return res.status(200).json(commentList);
  } catch (error) {
    logger.error(
      `An error has occurred while trying to fetch comment ${parentId}'s children: ${error}`
    );
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/**
 * POST method. Deletes a comment, it's children and the likes of the deleted comment and of all its children comments.
 * Request: the comment ID.
 * Response: a message that indicates whether or not the comment has been deleted to the database.
 */

export const deleteComment = async (req: any, res: any) => {
  const id = req.body.id;

  try {
    await Comment.deleteMany({ parentId: id });
    await Comment.deleteOne({ _id: id });
    const children = await Comment.find({ parentId: id });
    await Promise.all(
      (
        await children
      ).map(async (comment) => {
        await Like.deleteMany({ parentId: comment.id });
      })
    );
    await Like.deleteMany({ objectId: id });
    return res.status(200).json("Comment deleted successfully");
  } catch (error) {
    logger.error(
      `An error has occurred while trying to delete comment ${id}: ${error}`
    );
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/**
 * 
 * @param req the comment ID and the new content
 * @param res a message that states whether or not the comment had been edited. 
 */

export const editComment = async (
  req: Request,
  res: Response
): Promise<Response>=>{
  const { id, content } = req.body;

  try {
    await Comment.updateOne({ _id: id }, { $set: { content: content } });
    return res.status(200).json("Comment edited successfully!");
  } catch (error) {
    logger.error(`An error has occurred while trying to edit comment ${id}: ${error}`)
    return res.status(500).json(`Internal server error: ${error}`);
  }
};
