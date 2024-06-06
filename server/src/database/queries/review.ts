import mongoose from "mongoose";
import book from "../models/book";
import user from "../models/user";
import comment from "../models/comment";

// Adding a new review to the database

export const addReview = async (req: any, res: any) => {
  const { id, userId, date, stars, finished, content, spoilers } = req.body;
  const newReview = {
    userId: userId,
    date: date,
    stars: stars,
    finished: finished,
    content: content,
    spoilers: spoilers,
  };
  try {
    const check = await book.findOne({ _id: id, "reviews.userId": userId });

    if (check) {
      return res.status(401).json("You had already given a review!");
    }

    const update = await book.updateOne(
      { _id: id },
      { $push: { reviews: newReview } }
    );
    const update_grade = await book.updateOne(
      { _id: id },
      { $push: { grade: stars } }
    );
    if (!update || !update_grade) {
      return res.status(401).json("Something went wrong!");
    }
    return res.status(200).json("Review submitted successfully!");
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

// Fetching all the reviews a book has

export const fetchReviews = async (req: any, res: any) => {
  const id = req.params.id;

  try {
    const parent = await book.findOne({ _id: id });
    if (!parent) {
      return res.status(404).json("Cannot find this book!");
    }

    const reviews = await Promise.all(
      parent.reviews.map(async (review: any) => {
        const userId = review.userId;
        const writer = await user.findOne({ _id: userId }).lean();
        if (!writer) {
          return { ...review.toObject(), avatar: null, username: "[deleted]" };
        }
        return {
          ...review.toObject(),
          avatar: writer.avatar,
          username: writer.username,
        };
      })
    );

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};

// Fetching reviews by the number of stars they have

export const sortStars = async (req: any, res: any) => {
  const id = req.params.id;
  const stars = req.params.stars;

  const min: number = Number(stars);
  const max: number = Number(stars) + 0.99;

  try {
    const reviews = await book.aggregate([
      {
        $match: { _id: id },
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
        const writer = await user.findOne({ _id: userId }).lean();
        if (!writer) {
          return { ...review.review, avatar: null, username: "[deleted]" };
        }
        return {
          ...review,
          avatar: writer.avatar,
          username: writer.username,
        };
        return review;
      })
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

// Fetching reviews based on wether or not the user has finished the book

export const sortFinished = async (req: any, res: any) => {
  const id = req.params.id;
  const finished = req.params.finished;

  try {
    const reviews = await book.aggregate([
      {
        $match: { _id: id },
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
        const writer = await user.findOne({ _id: userId }).lean();
        if (!writer) {
          return { ...review.review, avatar: null, username: "[deleted]" };
        }
        return {
          ...review,
          avatar: writer.avatar,
          username: writer.username,
        };
        return review;
      })
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

// Editing a review



export const editReview = async (req: any, res: any) => {
    const { id, content, stars, finished, bookId, oldStars } = req.body;
  
    try {
      const edit = await book.updateOne(
        { _id: bookId, "reviews._id": id },
        {
          $set: {
            "reviews.$.content": content,
            "reviews.$.stars": stars,
            "reviews.$.finished": finished,
          },
        }
      );
      const edit2 = await book.updateOne(
        { _id: bookId },
        { $pull: { grade: oldStars } }
      );
      const edit3 = await book.updateOne(
        { _id: bookId },
        { $push: { grade: stars } }
      );
      if (edit && edit2 && edit3) {
        return res.status(200).json("Review edited successfully!");
      } else {
        return res.status(500).json("Something went wrong while submitting your edit!");
      }
    } catch (error) {
     return res
        .status(500)
    .json(`Internal server error: ${error}`);
    }
  };

// Deleting the review

export const deleteReview = async (req: any, res: any) => {
    const { stars, id, reviewId } = req.body;
  
    try {
      await book.updateOne(
        { _id: id },
        { $pull: { reviews: { _id: reviewId } } }
      );
      await book.updateOne({ _id: id }, { $pull: { grade: stars } });
      await comment.deleteMany({ parentId: reviewId });
      return res.status(200).json("Review deleted successfully");
    } catch (error) {
     return res
        .status(500)
        .json(`Internal server error: ${error}`);
    }
  };