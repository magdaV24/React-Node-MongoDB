// Add a book to the database;

import mongoose from "mongoose";
import books from "../models/book";
import comments from "../models/comment";
import cloudinary from "../../cloudinary/cloudinaryConfig";
import likes from "../models/likes";

export const add_book = async (req: any, res: any) => {
  const {
    title,
    author,
    published,
    description,
    genres,
    pages,
    language,
    photos,
    reviews,
    grade,
  } = req.body;

  try {
    const test = await books.findOne({ title, author });

    if (test) {
      return res.status(401).json("This book had already been added to the database!");
    } else {
      const data = {
        title: title,
        author: author,
        published: published,
        description: description,
        genres: genres,
        pages: pages,
        language: language,
        photos: photos,
        reviews: reviews,
        grade: grade,
      };

      await books.insertMany([data]);

      return res.status(200).json("Book added successfully!");
    }
  } catch (error) {
    return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};

// Fetch all the books

export const fetch_books = async (req: any, res: any) => {
  try {
    const data = await books.find();
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};

// Fetch a book

export const fetch_book = async (req: any, res: any) => {
  const title = req.params.title;

  try {
    const data = await books.findOne({ title: title });

    if (!data) {
      return res.status(401).json("Could not find the book!")
    }

    return res.json({
      _id: data._id,
      title: data.title,
      author: data.author,
      published: data.published,
      description: data.description,
      genres: data.genres,
      pages: data.pages,
      language: data.language,
      photos: data.photos,
      reviews: data.reviews,
      grade: data.grade,
    });
  } catch (error) {
    return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};

// Adding a review

export const add_review = async (req: any, res: any) => {
  const {
    id,
    user_id,
    date,
    stars,
    finished,
    content,
    username,
    avatar,
    spoilers,
  } = req.body;
  const newReview = {
    user_id: user_id,
    date: date,
    stars: stars,
    finished: finished,
    content: content,
    username: username,
    avatar: avatar,
    spoilers: spoilers,
  };
  try {
    const check = await books.findOne({ _id: id, "reviews.user_id": user_id });

    if (check) {
      return res.status(401).json("You had already given a review!");
    }

    const update = await books.updateOne(
      { _id: id },
      { $push: { reviews: newReview } }
    );
    const update_grade = await books.updateOne(
      { _id: id },
      { $push: { grade: Number(stars) } }
    );
    if (!update || !update_grade) {     
       return res.status(401).json("Something went wrong!");

    }
    return res.status(200).json("Success!");
  } catch (error) {
    return res
    .status(500)
    .json("Internal server error. Please try again later.");
  }
};

export const fetch_reviews = async (req: any, res: any) => {
  const id = req.params.id;

  try {
    const result = await books.findOne({ _id: id });
    if (!result) {
      return res.json("Cannot find this book!");
    }
    return res.json(result.reviews);
  } catch (error) {
   return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};

// Deleting a user's review

export const delete_user_review = async (req: any, res: any) => {
  const { stars, id, review_id } = req.body;

  try {
    await books.updateOne(
      { _id: id },
      { $pull: { reviews: { _id: review_id } } }
    );
    await books.updateOne({ _id: id }, { $pull: { grade: stars } });
    await comments.deleteMany({ parent_id: review_id });
    return res.json("Success!");
  } catch (error) {
   return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};

// Editing one's review

export const edit_review = async (req: any, res: any) => {
  const { id, content, stars, finished, book_id, old_stars } = req.body;

  try {
    const edit = await books.updateOne(
      { _id: book_id, "reviews._id": id },
      {
        $set: {
          "reviews.$.content": content,
          "reviews.$.stars": stars,
          "reviews.$.finished": finished,
        },
      }
    );
    const edit2 = await books.updateOne(
      { _id: book_id },
      { $pull: { grade: old_stars } }
    );
    const edit3 = await books.updateOne(
      { _id: book_id },
      { $push: { grade: stars } }
    );
    if (edit && edit2 && edit3) {
      return res.json("Success!");
    } else {
      return res.json("Something went wrong!");
    }
  } catch (error) {
   return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};

export const sort_by_finished = async (req: any, res: any) => {
  const id = req.params.id;
  const finished = req.params.finished;

  try {
    const reviews = await books.aggregate([
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
      return res.json("No reviews found!");
    }

    return res.json(reviews[0].reviews);
  } catch (error) {
   return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};

export const sort_by_stars = async (req: any, res: any) => {
  const id = req.params.id;
  const stars = req.params.stars;

  const min: number = Number(stars);
  const max: number = Number(stars) + 0.99;

  try {
    const reviews = await books.aggregate([
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
      return res.json(`Can't find any reviews.`);
    }
    return res.json(reviews[0].reviews);
  } catch (error) {
   return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};

export const delete_book = async (req: any, res: any) => {

  const { id, photos } = req.body;

  try {
    await books.deleteMany({ _id: id });
    await comments.deleteMany({ book_id: id });
    await likes.deleteMany({book_id: id})

    if (!photos || !Array.isArray(photos)) {
      return res.json("Invalid request");
    }

    await Promise.all(
      photos.map((photo) => cloudinary.v2.uploader.destroy(photo))
    );

    return res.json("Success!");
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while trying to delete this book." });
  }
};

export const add_photo = async (req: any, res: any) => {
  const { id, photo } = req.body;
  try {
    const check = await books.findOne({ _id: id });

    if (!check) {
      return res.json("Could not find this book!");
    }

    const update = await books.updateOne(
      { _id: id },
      { $push: { photos: photo } }
    );

    if (!update) {
      res.json("Something went wrong while trying to upload this photo!");
    }
    return res.json("Success!");
  } catch (error) {
   return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};

export const delete_photo = async (req: any, res: any) => {
  const { id, photo } = req.body;

  try {
    const check = await books.findOne({ _id: id });

    if (!check) {
      return res.status(401).json("Could not find this book!");
    }

    const update = await books.updateOne(
      { _id: id },
      { $pull: { photos: photo } }
    );

    if (!update) {
    return res.status(401).json("Could not delete this photo!");
    }
    await cloudinary.v2.uploader.destroy(photo);
    return res.status(200).json("Photo deleted successfully from MongoDB and Cloudinary!");
  } catch (error) {
   return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};

export const edit_field = async (req: any, res: any) => {
  const { id, field, update } = req.body;

  try {
    const check = await books.findOne({ _id: id });

    if (!check) {
      return res.status(401).json("Could not find this book!");
    }

    const updateField = await books.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { [field]: update } }
    );

    if (!updateField) {
      res.status(401).json("Something went wrong while trying to edit this field!");
    }
    return res.status(200).json("Success!");
  } catch (error) {
   return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};

export const search = async (req: any, res: any) => {
  const input = req.params.input;

  try {
    const result = await books.find({
      $or: [
        { title: { $regex: input, $options: "i" } },
        { author: { $regex: input, $options: "i" } },
      ],
    });

    if (!result) {
      return res.json("Nothing found");
    }

    return res.json(result);
  } catch (error) {
   return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};