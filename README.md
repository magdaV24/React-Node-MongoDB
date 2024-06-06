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

### Backend
The server side of the app is developed using Node and MongoDB, with other dependencies in order to add more functionality to the server.

#### Dependencies

* **Cors:** Used to enable communication between the server and the client.
* **Dotenv:** Loads environment variables from a .env file, facilitating configuration management.
* **Express:** A NodeJS framework that I used in order to set up the API.
* **Mongoose:** This was my choice for the database. 
* **Bcrypt:**  A widely-used open-source library for securely hashing passwords.

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

