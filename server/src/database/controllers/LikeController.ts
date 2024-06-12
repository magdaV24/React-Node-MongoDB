import logger from "../../config/logger";
import Like from "../models/LikeModel";
import { Request, Response } from "express";

/**
 * POST method. It receives the user ID and the object ID in order to give the object (comment/review) a like, or take it, if the user 
 * has already liked the object. It also saves the book ID, so that, if a book gets deleted from the database, all the like for all 
 * its reviews and comments get deleted as well.
 * @param req the object ID, the book ID, the user ID
 * @param res message indicating whether or not the object has been liked
 */
export const likeObject = async (req: Request, res: Response): Promise<Response> => {
  const { objectId, bookId, userId } = req.body;

  try {
    const existingLike = await Like.findOne({ objectId: objectId, userId: userId });

    if (existingLike) {
      await Like.deleteOne({ objectId: objectId, userId: userId });
      return res.status(200).json("Liked retrieved successfully!");
    } else {
      await Like.insertMany({
        objectId: objectId,
        userId: userId,
        bookId: bookId,
      });
      return res.status(200).json("Object liked successfully!");
    }
  } catch (error) {
    logger.error(`An error occurred while trying to interact with object ${objectId}.`)
    return res
      .status(500)
      .json(`Internal server error: ${error}`);
  }
};

/**
 * GET method. Checks if the user has liked the comment/review
 * @param req the object ID and the user ID
 * @param res a boolean that indicates whether or not the logged in user has liked the object
 */

export const checkIfLiked = async (req: Request, res: Response): Promise<Response> => {
  const objectId = req.params.objectId;
  const userId = req.params.userId;

  try {
    const check = await Like.findOne({objectId: objectId, userId: userId})

    if(!check){
        return res.status(200).json(false)
    }else {
        return res.status(200).json(true)
    }
  } catch (error) {
    logger.error(`Error occurred while checking if object ${objectId} has been liked by the current user.`)
    return res
      .status(500)
      .json(`Internal server error: ${error}`);
  }
};
/**
 * GET message. Counts the likes of a review/comment.
 * @param req the object's ID
 * @param res the count of likes the object has
 */

export const countLikes = async (req: Request, res: Response): Promise<Response> => {
  const objectId = req.params.objectId;

  try {
    const count = await Like.find({objectId: objectId});

    return res.status(200).json(count.length)
  } catch (error) {
    logger.error(`Error occurred while counting the likes of object ${objectId}`)
    return res
      .status(500)
      .json(`Internal server error: ${error}`);
  }
};
