import cloudinary from "../../cloudinary/cloudinaryConfig";
import book from "../models/BookModel";
import comment from "../models/CommentModel";
import likes from "../models/LikeModel";

export const addBook = async (req: any, res: any) => {
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
    const test = await book.findOne({ title, author });

    if (test) {
      return res
        .status(401)
        .json("This book had already been added to the database!");
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

      await book.insertMany([data]);

      return res.status(200).json("Book added successfully!");
    }
  } catch (error) {
    return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};

export const fetchBooks = async (req: any, res: any) => {
  try {
    const data = await book.find();

    const result = await Promise.all(
      data.map(async (book: any) => {
        const thumbnail = book.photos[0]
      
        return {
          ...book.toObject(),
          thumbnail: thumbnail
        };
      })
    );
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

export const fetchBook = async (req: any, res: any) => {
  const title = req.params.title;

  try {
    const data = await book.findOne({ title: title });

    if (!data) {
      return res.status(404).json("Could not find the book!");
    }
 return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

export const addPhoto = async (req: any, res: any) => {
  const { id, photo } = req.body;
  try {
    const check = await book.findOne({ _id: id });

    if (!check) {
      return res.json("Could not find this book!");
    }

    const update = await book.updateOne(
      { _id: id },
      { $push: { photos: photo } }
    );

    if (!update) {
      res.json("Something went wrong while trying to upload this photo!");
    }
    return res.json("Success!");
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

export const deletePhoto = async (req: any, res: any) => {
  const { id, photo } = req.body;

  try {
    const check = await book.findOne({ _id: id });

    if (!check) {
      return res.status(401).json("Could not find this book!");
    }

    const update = await book.updateOne(
      { _id: id },
      { $pull: { photos: photo } }
    );

    if (!update) {
      return res.status(401).json("Could not delete this photo!");
    }
    await cloudinary.v2.uploader.destroy(photo);
    return res
      .status(200)
      .json("Photo deleted successfully from MongoDB and Cloudinary!");
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

export const editFields = async (req: any, res: any) => {
  const { id, title, author, description, pages, genres, language, published } =
    req.body;

  try {
    const check = await book.findOne({ _id: id });

    if (!check) {
      return res.status(401).json("Could not find this book!");
    }

    const updateField = await book.updateOne(
      { _id: id },
      {
        $set: {
          title,
          author,
          description,
          pages,
          genres,
          language,
          published,
        },
      }
    );

    if (!updateField) {
      return res
        .status(500)
        .json("Something went wrong while trying to edit this field!");
    }

    return res.status(200).json("Book edited successfully!");
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

// Search functionality

export const search = async (req: any, res: any) => {
  const input = req.body.input;
  if (typeof input !== "string") {
    return res.status(400).json({ error: "Input must be a string" });
  }
  try {
    const result = await book.find({
      $or: [
        { title: { $regex: input, $options: "i" } },
        { author: { $regex: input, $options: "i" } },
      ],
    });

    if (!result) {
      return res
        .status(200)
        .json(`Searching for ${input} returned no results.`);
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

// Deleting a book from the database

export const deleteBook = async (req: any, res: any) => {
  const { id, photos } = req.body;

  try {
    await book.deleteMany({ _id: id });
    await comment.deleteMany({ bookId: id });
    await likes.deleteMany({ bookId: id });

    if (!photos || !Array.isArray(photos)) {
      return res.json("Invalid request");
    }

    await Promise.all(
      photos.map((photo) => cloudinary.v2.uploader.destroy(photo))
    );

    return res.status(200).json("Book deleted successfully from the database!");
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while trying to delete this book." });
  }
};
