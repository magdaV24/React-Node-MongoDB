import { Request, Response } from "express";
import cloudinary from "../../cloudinary/cloudinaryConfig";
import { Book, BookInterface } from "../models/BookModel";
import comment from "../models/CommentModel";
import likes from "../models/LikeModel";
import logger from "../../config/logger";

/*
POST method. Adds a new book entry to the database.
Request: Information about the book.
Response: Message that indicates whether or not the book has been successfully added to the database. 
*/

export const addBook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, author } = req.body;
  try {
    const existingBook = await Book.findOne({ title, author });
    if (existingBook) {
      logger.error(
        `${title} by ${author} has already been saved in the database!`
      );
      return res
        .status(401)
        .json("This book had already been added to the database!");
    }
    const data = {
      ...req.body,
      reviews: [],
      grade: [],
    };

    await Book.insertMany([data]);
    logger.info(
      `${title} by ${author} has been successfully added to the database.`
    );
    return res.status(200).json("Book saved successfully!");
  } catch (error) {
    logger.error("Error adding the book to the database:", error);
    return res
      .status(500)
      .json("Internal server error. Please try again later.");
  }
};
/*
GET method. Fetches all the books from the database.
Response: The list of books in the database. 
*/

export const fetchBooks = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const books = await Book.find(); // fetching all the books from MongoDB

    // Map over the books and include the first photo as the thumbnail
    const result = await Promise.all(
      books.map(async (book: BookInterface) => {
        // Ensure photos is an array and get the first photo as the thumbnail
        const photos = Array.isArray(book.photos) ? book.photos : [];
        const thumbnail = photos.length > 0 ? photos[0] : null;

        return {
          ...book.toObject(),
          thumbnail: thumbnail,
        };
      })
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/*
GET method. Adds the book for the BookPage.
Request: the book's title.
Response: the entry of the specified book. 
*/

export const fetchBook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const title = req.params.title;

  try {
    /* It checks if the title is corresponding to an existing book in the database
    If it  doesn't, it sends a Not Found error.
    It if does, it sends the book to the frontend, to be displayed.
    */
    const book = await Book.findOne({ title: title });

    if (!book) {
      return res.status(404).json("Could not find the book!");
    }
    logger.info(`${title}  has been successfully fetched from the database.`);
    return res.status(200).json(book);
  } catch (error) {
    logger.error(
      `Error trying to fetch the book with the title ${title}: ${error}`
    );
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/*
POST method. Adds a new photo to a book entry.
Request: the book's ID and the public_id of the photo.
Response: a message that reflects whether or not the adding of the photo was successful. 
*/

export const addPhoto = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id, photo } = req.body;
  try {
    /*
    It checks to see if the book can be found in the database.
    Given that the photo is sent to Cloudinary first, if an error appears, I ensured that the photo will be deleted from the 
    Cloudinary folder of this project.
    If the book isn't found, the photo is deleted from Cloudinary and a 404 error is sent to the client.
    If the id is correct, then the public_id is added to the array.
    */
    const check = await Book.findOne({ _id: id });

    if (!check) {
      await cloudinary.v2.uploader.destroy(photo);
      return res.status(404).json("Could not find the book!");
    }

    const update = await Book.updateOne(
      { _id: id },
      { $push: { photos: photo } }
    );

    if (!update) {
      await cloudinary.v2.uploader.destroy(photo);
      res.json("Something went wrong while trying to upload this photo!");
    }
    logger.info(
      `Photo has been successfully added to the database and uploaded to Cloudinary.`
    );
    return res.json(
      "Photo has been successfully added to the database and uploaded to Cloudinary."
    );
  } catch (error) {
    await cloudinary.v2.uploader.destroy(photo);
    logger.error("Error while adding a new photo:", error);
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/*
POST method. Deletes a photo from the photos array.
Request: the book's ID and the public_id of the photo.
Response: a message of success or failure. 
*/

export const deletePhoto = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id, photo } = req.body;
  /*
First, if looks for the book in the database.
If the the book cannot be found, it returns a 404 error.
If it does exist, the public_id is pulled from the array.
If no document is updated, then a 400 error message will be sent.
If everything works, a success message will be sent to the frontend.
*/
  try {
    const book = await Book.findOne({ _id: id });

    if (!book) {
      return res.status(404).json("Could not find the book!");
    }

    const update = await Book.updateOne(
      { _id: id },
      { $pull: { photos: photo } }
    );

    if (update.modifiedCount === 0) {
      return res.status(400).json("Could not delete this photo!");
    }
    logger.info(
      `Photo has been successfully removed from the database and from Cloudinary.`
    );
    await cloudinary.v2.uploader.destroy(photo);
    return res
      .status(200)
      .json("Photo deleted successfully from MongoDB and Cloudinary!");
  } catch (error) {
    logger.error("Error while deleting the photo:", error);
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/*
POST method. Edits the chosen book from the database.
Request: The body of the Edit Book Form from the React App.
Response: A message to reflect whether or not the book has been edited.
*/

export const editBook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id, title, author, description, pages, genres, language, published } =
    req.body;

  try {
    const book = await Book.findOne({ _id: id });

    if (!book) {
      logger.error(`Book ${id} was not found.`);
      return res.status(401).json("Could not find this book!");
    }

    const updateField = await Book.updateOne(
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
      logger.error(`Book ${id} couldn't have been edited.`);
      return res
        .status(500)
        .json("Something went wrong while trying to edit this field!");
    }

    return res.status(200).json("Book edited successfully!");
  } catch (error) {
    logger.error("Error while editing the book:", error);
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/*
POST method. Searches the book entries to see if the input matches any author's name or book's title.
Request: The input from the user.
Response: The books that match the input.
*/

export const search = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const input = req.body.input;
  try {
    const result = await Book.find({
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
    logger.info(`The search for ${input} returned a result.`);
    return res.json(result);
  } catch (error) {
    logger.error("Error searching the database:", error);
    return res.status(500).json(`Internal server error: ${error}`);
  }
};

/*
POST method. Deletes the book from the database, alongside all the comments and likes linked to it. It also deletes the photos from 
the Cloudinary project folder.
Request: The book ID and the photos' public_ids.
Response: A message to reflect whether or not the book has been deleted from the database.
*/

export const deleteBook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id, photos } = req.body;

  try {
    const book = await Book.findOne({ _id: id });

    if (!book) {
      logger.error(`Book ${id} was not found.`);
      return res.status(401).json("Could not find this book!");
    }

    await Book.deleteMany({ _id: id });
    await comment.deleteMany({ bookId: id });
    await likes.deleteMany({ bookId: id });

    await Promise.all(
      photos.map((photo: string) => cloudinary.v2.uploader.destroy(photo))
    );
    logger.info(`Book ${id} and it's photos have been deleted.`);
    return res.status(200).json("Book deleted successfully from the database!");
  } catch (error) {
    logger.error("Error deleting the book from the database:", error);
    return res
      .status(500)
      .json(`An error occurred while trying to delete this book: ${error}`);
  }
};
