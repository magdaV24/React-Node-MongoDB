import mongoose from "mongoose";
import { Book } from "../models/BookModel";
import Comment from "../models/CommentModel";
import User from "../models/UserModel";
import Like from "../models/LikeModel";
import logger from "../../config/logger";
import { Request, Response } from "express";

/**
 * POST method. Adds a review to a book.
 * @param req - The request containing the user ID and their review input.
 * @param res - Response indicating whether or not the review has been registered.
 * @returns A message indicating success or failure.
 */

export const addReview = async (
  req: Request,
  res: Response
): Promise<Response> => {
  /**
   * Firstly, it deconstructs the request's body. The id and userID are used to check if the client has already left a review.
   * If they did, an error message is sent to the client.
   * If they didn't, the review is sent to the database and the grade is also updated, to contain the new review's grade.
   * It checks if the updates took place and sends an error message if they were unsuccessful.
   * It returns a success message if everything was successful.
   */
  const { id, userId, date, stars, finished, content, spoilers } = req.body;

  try {
    const book = await Book.findOne({ _id: id, "reviews.userId": userId });
    const newReview = {
      userId,
      date,
      stars,
      finished,
      content,
      spoilers,
    };
    if (book) {
      logger.error(`User ${userId} already wrote a review for book ${id}.`);
      return res.status(400).json("You had already given a review!");
    }

    const updateReviews = await Book.updateOne(
      { _id: id },
      { $push: { reviews: newReview } }
    );
    const updateGrade = await Book.updateOne(
      { _id: id },
      { $push: { grade: stars } }
    );

    if (updateReviews.modifiedCount === 0 || updateGrade.modifiedCount === 0) {
      return res
        .status(400)
        .json("Updating the reviews array of the grade has been unsuccessful!");
    }

    logger.info(`User ${userId}'s review was submitted successfully!`);
    return res.status(200).json("Review submitted successfully!");
  } catch (error) {
    logger.error(
      `An error occurred while user ${userId} trie to submit a review for book ${id}: ${error}.`
    );
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/**
 * GET method. Fetches reviews for the book on whose page the client visits.
 * @param req - The request containing the book ID in the params.
 * @param res - The response containing the reviews or an error message.
 * @returns A JSON response with the reviews or an error message.
 */

export const fetchReviews = async (
  req: Request,
  res: Response
): Promise<Response> => {
  /**
   * Firstly, it checks whether or not the parent book exists.
   * If it doesn't, returns a 404 error message.
   * If it does, it looks at each review and add to it data from the user that added the review: username and avatar.
   * It returns the updated array of reviews.
   */
  const id = req.params.id;

  try {
    const book = await Book.findOne({ _id: id });

    if (!book) {
      logger.error(`Book ${id} could not be found!`);
      return res.status(404).json("Cannot find this Book!");
    }

    const reviews = await Promise.all(
      book.reviews.map(async (review: any) => {
        const userId = review.userId;
        const user = await User.findOne({ _id: userId }).lean();
        if (!user) {
          return { ...review.toObject(), avatar: null, username: "[deleted]" };
        }
        return {
          ...review.toObject(),
          avatar: user.avatar,
          username: user.username,
        };
      })
    );

    return res.status(200).json(reviews);
  } catch (error) {
    logger.error(`Error fetching the book ${id}'s reviews: ${error}.`);
    return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};

/**
 * GET method. Sorts and fetches reviews with a specific star rating for a book.
 * @param req - The request containing the book ID and star rating in the params.
 * @param res - The response containing the filtered reviews or an error message.
 * @returns A JSON response with the filtered reviews or an error message.
 */

export const sortStars = async (
  req: Request,
  res: Response
): Promise<Response> => {
  /**
   * It calculates the min and the max, so that, if the user selects the value 4, it returns reviews with the grades:
   * 4, 4.25, 4.5, 4.75.
   * It checks if the book exists and fetches te reviews in the [min, max] interval.
   * If there are no reviews, it returns an empty array.
   */
  const { id, stars } = req.params;

  const min = parseFloat(stars);
  const max = min + 0.99;

  try {
    const book = await Book.findOne({ _id: id });

    if (!book) {
      logger.error(`Book ${id} could not be found!`);
      return res.status(404).json("Cannot find this Book!");
    }

    const reviews = await Book.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $project: {
          _id: 1,
          reviews: {
            $filter: {
              input: "$reviews",
              as: "review",
              cond: {
                $and: [
                  { $gte: ["$$review.stars", min] },
                  { $lte: ["$$review.stars", max] },
                ],
              },
            },
          },
        },
      },
    ]);

    if (reviews.length === 0) {
      return res.json([]);
    }
    const result = await Promise.all(
      reviews[0].reviews.map(async (review: any) => {
        const userId = review.userId;
        const writer = await User.findOne({ _id: userId }).lean();
        if (!writer) {
          return { ...review.review, avatar: null, username: "[deleted]" };
        }
        return {
          ...review,
          avatar: writer.avatar,
          username: writer.username,
        };
      })
    );
    return res.json(result);
  } catch (error) {
    logger.error(
      `Error occurred while trying to sort book ${id}'s reviews: ${error}.`
    );
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/**
 * GET method. Sorts and fetches reviews with a specific finished status for a book.
 * @param req - The request containing the book ID and finished status in the params.
 * @param res - The response containing the filtered reviews or an error message.
 * @returns A JSON response with the filtered reviews or an error message.
 */

export const sortFinished = async (
  req: Request,
  res: Response
): Promise<Response> => {
  /**
   * It checks if the book exists and if it does, it fetches the reviews that have either the "Finished" or "DNF" status, based on the
   * what the user has chosen.
   * If there are no reviews, it returns an empty array.
   */
  const { id, finished } = req.params;

  try {
    const book = await Book.findOne({ _id: id });

    if (!book) {
      logger.error(`Book ${id} could not be found!`);
      return res.status(404).json("Cannot find this Book!");
    }
    const reviews = await Book.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $project: {
          _id: 0,
          reviews: {
            $filter: {
              input: "$reviews",
              as: "review",
              cond: { $eq: ["$$review.finished", finished] },
            },
          },
        },
      },
    ]);
    if (reviews.length === 0) {
      return res.json([]);
    }

    const result = await Promise.all(
      reviews[0].reviews.map(async (review: any) => {
        const userId = review.userId;
        const writer = await User.findOne({ _id: userId }).lean();
        if (!writer) {
          return { ...review.review, avatar: null, username: "[deleted]" };
        }
        return {
          ...review,
          avatar: writer.avatar,
          username: writer.username,
        };
      })
    );
    return res.json(result);
  } catch (error) {
    logger.error(
      `Error occurred while trying to sort book ${id}'s reviews: ${error}.`
    );
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/**
 * POST method. Edits a review.
 * @param req - The request containing the review ID, new content, star rating, finished status, book ID, and old star rating.
 * @param res - The response indicating success or failure of the edit operation.
 * @returns A JSON response with a success or error message.
 */

export const editReview = async (
  req: Request,
  res: Response
): Promise<Response> => {
  /**
   * It checks if the book exists.
   * If it does, it updates the review and pulls the old grade and pushes the new one.
   */
  const { id, content, stars, finished, bookId, oldStars } = req.body;

  try {
    const book = await Book.findOne({ _id: bookId });

    if (!book) {
      logger.error(`Book ${bookId} could not be found!`);
      return res.status(404).json("Cannot find this Book!");
    }

    const editReview = await Book.updateOne(
      { _id: bookId, "reviews._id": id },
      {
        $set: {
          "reviews.$.content": content,
          "reviews.$.stars": stars,
          "reviews.$.finished": finished,
        },
      }
    );
    let editGrade;
    if (stars !== oldStars) {
      editGrade = await Book.updateOne(
        { _id: bookId },
        {
          $pull: { grade: oldStars },
          $push: { grade: stars },
        }
      );
    }
    if (
      editReview.modifiedCount === 0 ||
      (editGrade && editGrade.modifiedCount === 0)
    ) {
      return res
        .status(400)
        .json("Updating the review or the grade has been unsuccessful!");
    }
    return res.status(200).json("Review edited successfully!");
  } catch (error) {
    logger.error(
      `Editing review ${id} of book ${bookId} has been unsuccessful: ${error}`
    );
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/**
 * POST method. Deletes a review, its children comments and the likes given to them and deleted the grade from the book's grades array.
 * @param req - The request containing the review ID, the book's grade, and the book ID.
 * @param res - The response indicating success or failure of the deletion operation.
 * @returns A JSON response with a success or error message.
 */

export const deleteReview = async (
  req: Request,
  res: Response
): Promise<Response> => {
  /**
   * Checks if the id corresponds to a book.
   * If it does, it updates it by pulling the review and the grade. Then deletes the comments under the review and the likes
   * the review and it' children received.
   * if the book ID is incorrect, a 404 error is sent to the front end.
   */
  const { stars, id, reviewId } = req.body;

  try {
    const book = await Book.findOne({ _id: id });

    if (!book) {
      logger.error(`Book ${id} could not be found!`);
      return res.status(404).json("Cannot find this Book!");
    }
    await Book.updateOne(
      { _id: id },
      {
        $pull: {
          reviews: { _id: reviewId },
          grade: stars,
        },
      }
    );
    const children = Comment.find({ parentId: reviewId });
    await Promise.all(
      (
        await children
      ).map(async (comment) => {
        await Like.deleteMany({ objectId: comment.id });
      })
    );
    await Comment.deleteMany({ parentId: reviewId });
    await Like.deleteMany({ objectId: reviewId });
    return res.status(200).json("Review deleted successfully");
  } catch (error) {
    logger.error(`Error while attempting to delete the book ${id}: ${error}.`);
    return res.status(500).json(`Internal server error: ${error}`);
  }
};
