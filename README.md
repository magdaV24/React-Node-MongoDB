# NovelNotes - A React-Node-MongoDB web application

## Overview

Drawing inspiration from popular websites like Goodreads and Storygraph, I have developed NovelNotes, a web application designed for book enthusiasts who want to share their passion with the world.

## Technologies Used

- A ReactJS single page applications as this project's frontend;
- Context management with React Context;
- File uploading facilitated by Cloudinary;
- Material UI is used for it's large library of components and the ease of implementing themes;
- Testing with React Testing Library and Vitest;
- The server side is developed using NodeJS;
- The data is saved in a MongoDB database;


## Functionality

In order to make this app as interesting and useful as possible, it includes various functionalities such as context management, photo uploading, writing reviews and replies to them, liking the reviews/comments, searching through the book collection, sorting the reviews or giving the books a reading status.


## Backend
The server side of the app is developed using Node, alongside Express for handling routes and middleware. It also employs Mongoose, in order to integrate MongoDB and execute database operations.

### Middleware

* **Helmet:** for security.
* **CORS:** for allowing requests from specific origins.
* **Express JSON parser:** for parsing JSON request bodies.

#### Routes

The server.ts file contains all the routes necessary for the app. For example: 
 ```ts
  app.use(userRouter);
````
where userRouter is the following: 

```ts
const router = express.Router();

router.post("/register", registrationValidationRules, validate, register);
router.post("/login", loginValidationRules, validate, login);
router.get("/fetchUser/:id?", fetchUserValidationRules, validate, fetchUser);
router.post(
  "/addReadingStatus",
  readingStatusValidationRules,
  validate,
  addReadingStatus
);
router.post(
  "/changeReadingStatus",
  readingStatusValidationRules,
  validate,
  changeReadingStatus
);
router.get(
  "/findReadingStatus/:userId/:bookId",
  fetchByReadingStatusValidationRules,
  validate,
  findReadingStatus
);
router.get(
  "/fetchDrawerBooks/:userId?/:field",
  fetchDrawerBooksValidationRules,
  validate,
  fetchByReadingStatus
);

export default router;
```

The validate middleware

```ts

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
```
is responsible for validating the requests coming to the backend, while the validation rules

```ts
export const registrationValidationRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address!")
    .isString()
    .withMessage("Email must be a string"),
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 6 })
    .withMessage("Username must be at least 6 characters long")
    .isString()
    .withMessage("Username must be a string"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(passwordRegex)
    .withMessage(
      "Password must contain at least one uppercase letter, one number, and one special character (! . @ # $ % ^ & *)."
    )
    .isString()
    .withMessage("Password must be a string"),
  body("avatar")
    .notEmpty()
    .withMessage("Avatar is required.")
    .isString()
    .withMessage("Avatar must be a string"),
];
```
are specifically designed for the register method. Both the validate middleware and the validation rules middleware are constructed with the help of express-validator, a middleware for Express that offers validation functionality to the server.

The methods can use services, meant to make the code cleaner, more scalable and reusable. For example, the register method

```ts
export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, username, password, avatar } = req.body;
    const token = await registerUser(username, email, password, avatar);
    return res.status(201).json(token);
  } catch (error) {
    if (req.body && req.body.avatar) {
      await cloudinary.v2.uploader.destroy(req.body.avatar);
    }
    logger.error("Error during registration:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
```
uses a service for registering the user and sending the auth token to the frontend.

```ts
export const registerUser = async (
  email: string,
  username: string,
  password: string,
  avatar: string
) => {
  try {
    /*
    First, it checks if any user was registered with either the email or the username provided by the client;
    If there is another user with either of these specific credentials, the photo submitted to Cloudinary is deleted from the 
    project folder and an error is thrown.
    If the credentials are new, the password is hashed and a new user entry is created.
    The user is also logged in, with a value of rememberMe of false.
    */
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      await cloudinary.v2.uploader.destroy(avatar);
      if (existingUser.email === email) {
        throw new Error("The email provided is already in use!");
      }
      if (existingUser.username === username) {
        throw new Error("This username is taken!");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      avatar,
      role: "Admin",
      currentlyReading: [],
      wantToRead: [],
      read: [],
    };

    await User.insertMany([newUser]);
    const authToken = await loginUser(newUser.username, false);
    return authToken;
  } catch (error) {
    logger.error("Error during user registration:", error);
    throw new Error("Error while trying to register the user: " + error);
  }
};
```

#### Other dependencies

* **Dotenv:** Loads environment variables from a .env file, facilitating configuration management.
* **Bcrypt:**  A widely-used open-source library for securely hashing passwords.
* **Winston:** A dependency used to create a logger for various messages during the execution of the server. 

### Frontend
This project's client side is constructed with React, incorporating various features to enhance the overall user experience.

#### Features

* **MaterialUI:** 
* **React Hook Form:** for handling form submission.
* **Cloudinary:** Integrated as a cloud-based media management and delivery service, enabling users to upload one or multiple pictures.
* **React Query:** The app utilizes this library to manage and fetch data seamlessly, providing a responsive and dynamic user experience.
* **Axios:**  for the management of HTTP requests to the server.
* **React Helmet:**  for editing the application' tab.
* **Vitest:** Paired with React Testing Library and jsdom, Vitest was my dependency choice for testing the hooks and the components.

#### Context management

In order to facilitate the state sharing across the application's components and set global state, such as the user's token or the theme, I decided to incorporate state management in my application. React Context was my choice of tool for this part of the app's functionality. 

#### The Application

##### Forms

![Image Alt Text](/client/public/project-photos/delete-form.png)
![Image Alt Text](/client/public/project-photos/review-edit.png)


##### The Home Page
![Home Page](/client/public/project-photos/home-page.png)

##### The Book Page

![Book Page](/client/public/project-photos/book-page.png)

##### The Search Bar

![Search Bar](/client/public/project-photos/search-bar.png)

##### Success and Error messages

![Success](/client/public/project-photos/success-message.png)
![Error](/client/public/project-photos/error-message.png) 

## Database

This app utilizes MongoDB for data storage. MongoDB is a NoSQL database that provides a flexible and scalable solution for storing and retrieving data. The choice of MongoDB was driven by both the schema-less approach of a NoSQL database, that allows for the storage of diverse data types within the same collection and my desire to delve into the realm of NoSQL databases.

### MongoDB

MongoDB, a NoSQL and document oriented database, has a schema-less approach that allows for the storage of diverse data types within the same collection, providing flexibility for future modifications and expansions in the data structure

#### Collections
The database is organized into four collections: users, books, comments and likes, as they follow:

##### User
The collection that maintains user profiles within the app. Each user document is characterized by the following schema:
* **email and username:** strings that represent data about the user;
* **avatar:** the uploaded avatar's public_id;
* **password:** a string that is saved in a hashed form for safety purposes;
* **role:** the user's assigned role (admin or user);
* **want_to_read, currently_reading, read:** arrays of book ids, to track the reading status of a book;

##### Books
The collection of all the books the app has saved The can be added only by users that have the role of admin assigned to them. The collection's schema is as it follows:
* **title, author, description, language, published and pages:** strings and a number that represent data about the book;
* **photos:** an array that stores each uploaded photo's public_id;
* **genres:** an array that store the genres associated with the book;
* **reviews:** an array of review documents; the review schema allows for the storage of information such as the user id, content, if the review offers spoilers, if the reviews has finished the book, the number of stars they are giving the book, the date the review was given;
* **grade:** an array that stores each review's stars;

##### Comments
The collection that saves the comments. Given that I have chosen to display the comments in a nested system, each comments has a identifier for their parent.
* **username, avatar, date, content:** strings that represent data about the comment;
* **parent_id:** the identifier that allows for nested comments;
* **book_id, user_id:** identifiers for the book and the user associated with the comment;

##### Likes
The collection that tracks the users' interaction with the reviews and the comments and it's schema:

* **user_id:** the identifier of the user that gave a like;
* **book_id:** the identifier of the book, used for deleting purposes;
* **object_id:** the identifier of the object the user is interacting with; 

