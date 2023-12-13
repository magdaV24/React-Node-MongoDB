// Add a book to the database;

import mongoose from "mongoose";
import books from "../models/book";
import comments from "../models/comment";
import cloudinary from "../../cloudinary/cloudinaryConfig";

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
      return res.json("This book had already been added to the database!");
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

      return res.json("Success!");
    }
  } catch (error) {
    return res.json("Fail!");
  }
};

// Fetch all the books

export const fetch_books = async (req: any, res: any) => {
  try {
    const data = await books.find();
    return res.json(data);
  } catch (error) {
    console.log(error);
  }
};

// Fetch a book

export const fetch_book = async (req: any, res: any) => {
  const title = req.params.title;

  try {
    const data = await books.findOne({ title: title });

    if (!data) {
      return res.json(req.body);
    }

    return res.json({
      id: data._id,
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
    console.log(error);
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
    likes: [],
  };
  try {
    const check = await books.findOne({ _id: id, "reviews.user_id": user_id });

    if (check) {
      return res.json("You had already given a review!");
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
      throw new Error("Something went wrong!");
    }
    return res.json("Success!");
  } catch (error) {
    return res.json(`error: ${error}`);
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
    return res.json(`Error: ${error}`);
  }
};
// Like a review

export const like_review = async (req: any, res: any) => {
  const { book_id, object_id, user_id } = req.body;

  try {
   const result = await books.aggregate([
    { $match: { _id: book_id } },
    {
      $project: {
        review: {
          $filter: {
            input: '$reviews',
            as: 'review',
            cond: { $eq: ['$$review._id', object_id] }
          },
        },
        likesArray: '$reviews.likes',
      },
    },
    {
      $addFields: {
        userGaveLike: {
          $in: [user_id, { $arrayElemAt: ['$likesArray', 0] }],
        },
      }
    },
    {
      $addFields: {
        check: '$userGaveLike',
      },
    },
   ])

   if(result[0].check){
    await books.updateOne(
      { _id: book_id, "reviews._id": object_id },
      {
       $pull: { 'reviews.$.likes': user_id }
      }
    );
    return res.json("Successfully retracted the like.")
   }
   if(!result[0].check){
    await books.updateOne(
      { _id: book_id, "reviews._id": object_id },
      {
       $push: { 'reviews.$.likes': user_id }
      }
    );
    return res.json("Successfully gave a like.")
   }
  } catch (error) {
    return res.json(`Error: ${error}`);
  }

};

// Check if the user liked the review

export const check_liked_review = async (req: any, res: any) => {
  const book_id = req.params.book_id;
  const object_id = req.params.object_id;
  const user_id = req.params.user_id;

  const result = await books.aggregate([
    { $match: { _id: book_id } },
    {
      $project: {
        review: {
          $filter: {
            input: '$reviews',
            as: 'review',
            cond: { $eq: ['$$review._id', object_id] }
          },
        },
        likesArray: '$reviews.likes',
      },
    },
    {
      $addFields: {
        userGaveLike: {
          $in: [user_id, { $arrayElemAt: ['$likesArray', 0] }],
        },
      }
    },
    {
      $addFields: {
        check: '$userGaveLike',
      },
    },
   ])

   return res.json(result[0].check)

};

// Count the likes

export const count_review_likes = async (req: any, res: any) => {
  const book_id = req.params.book_id;
  const object_id = req.params.object_id;

  try {
    const result = await books.aggregate([
      { $match: { _id: book_id } },
      {
        $project: {
          review: {
            $filter: {
              input: '$reviews',
              as: 'review',
              cond: { $eq: ['$$review._id', object_id] }
            },
          },
        },
      },
      {
        $addFields: {
          count: { $size: { $arrayElemAt: ['$review.likes', 0] }, 
        },}
      },
    ])
    if (!result) {
      return res.json("Cannot solve!");
    }
    return res.json(result[0].count || 0);
  } catch (error) {
    return res.json(`Error: ${error}`);
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
    return res.json(`Error: ${error}`);
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
    return res.json(`Error: ${error}`);
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
    return res.json(`Error: ${error}`);
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
    return res.json(`Error: ${error}`);
  }
};

export const delete_book = async (req: any, res: any) => {

  const { id, photos } = req.body;

  try {
    await books.deleteMany({ _id: id });
    await comments.deleteMany({ book_id: id });

    if (!photos || !Array.isArray(photos)) {
      return res.status(400).json({ error: "Invalid request" });
    }

    await Promise.all(
      photos.map((photo) => cloudinary.v2.uploader.destroy(photo))
    );

    return res.json("Success");
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
    return res.json(`error: ${error}`);
  }
};

export const delete_photo = async (req: any, res: any) => {
  const { id, photo } = req.body;

  try {
    const check = await books.findOne({ _id: id });

    if (!check) {
      return res.json("Could not find this book!");
    }

    const update = await books.updateOne(
      { _id: id },
      { $pull: { photos: photo } }
    );

    if (!update) {
    return res.json("Could not delete this photo!");
    }

    await cloudinary.v2.uploader.destroy(photo);
    return res.json("Success!");
  } catch (error) {
    return res.json(`Error: ${error}`);
  }
};

export const edit_field = async (req: any, res: any) => {
  const { id, field, update } = req.body;

  try {
    const check = await books.findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!check) {
      return res.json("Could not find this book!");
    }

    const updateField = await books.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { [field]: update } }
    );

    if (!updateField) {
      res.json("Something went wrong!");
    }
    return res.json("Success!");
  } catch (error) {
    return res.json(`Error: ${error}`);
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
    return res.json(`Error: ${error}`);
  }
};