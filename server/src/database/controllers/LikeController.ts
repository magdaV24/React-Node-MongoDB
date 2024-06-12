import logger from "../../config/logger";
import Like from "../models/LikeModel";
import { Request, Response } from "express";

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

// Check if the current user liked the object

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
    
    return res
      .status(500)
      .json(`Internal server error: ${error}`);
  }
};
// Count the number of likes an object has

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
