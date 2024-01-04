# NovelNotes - A React-Node-MongoDB web application

## Overview

Drawing inspiration from popular websites like Goodreads and Storygraph, I have developed NovelNotes, a web application designed for book enthusiasts who want to share their passion with the world

## Table of Contents

- [Technologies Used](#technologies-used)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Database](#database)
- [Retrieving Data](#retrieving-data)
- [Functionality](#functionality)
  - [Context](#context)
  - [Uploading Photos](#uploading-photos)
  - [Writing Reviews](#writing-reviews)
  - [Commenting](#commenting)
  - [Liking Obects](#liking-objects)
  - [Reading Status](#reading-status)

## Technologies Used

The frontend is built using React, while the backend is implemented with Node and MongoDB.

### Frontend
This project's client side is constructed with React, incorporating various features to enhance the overall user experience.
#### Features

* **MaterialUI:** A React library thatprovides visually appealing components and theming, contributing to an enhanced user interface.
* **React Hook Form:** A React library meant to efortlessly handle form submissions.
* **Cloudinary:** Integrated as a cloud-based media management and delivery service, enabling users to upload one or multiple pictures.
* **React Query:** The app utilizes this library to manage and fetch data seamlessly, providing a responsive and dynamic user experience.
* **Axios:** A Javascript library for the management of HTTP requests to the server.

### Backend
The server side of the app is developed using Node and MongoDB, but other dependencies as well.

#### Dependencies

* **Cors:** Enables Cross-Origin Resource Sharing, allowing server-client communication.
* **Dotenv:** Loads environment variables from a .env file, facilitating configuration management.
* **Express:** A fast, minimalist web framework for Node.js that simplifies the process of building the API.
* **Mongoose:** A MongoDB object modeling tool that provides a schema-based solution for application data.
* **Helmet:** Adds a layer of protection  by setting various HTTP headers to protect against well-known web vulnerabilities.
* **Nodemon:**:A dependency that enhances the development workflow by automatically restarting the server whenever changes are detected in the source code.
* **Bcrypt:**  A widely-used open-source library for securely hashing passwords.

## Database

This app utilizes MongoDB for data storage. MongoDB is a NoSQL database that provides a flexible and scalable solution for storing and retrieving data. The choice of MongoDB was driven by both the schema-less aproach of a NoSQL database, that allows for the storage of diverse data types within the same collection and my desire to delve into the realm of NoSQL databases.

### MongoDB

MongoDB, a NoSQL and document oriented database, has a schema-less approach that allows for the storage of diverse data types within the same collection, providing flexibility for future modifications and expansions in the data structure

#### Collections
The databse is orginized into four collections: users, books, comments and likes, as they follow:

##### User
The collection that maintains user profiles within the app. Each user document is characterized by the following schema:
* **email and username:** strings that represent data about the user;
* **avatar:** the uploaded avatar's public_id;
* **password:** a string that is saved in a hashed form for safety purposes;
* **role:** the user's assigend role (admin or user);
* **want_to_read, currently_reading, read:** arrays of book ids, to track the reading status of a book;

##### Books
The collection of all the books the app has saved The can be added only by users that have the role of admin assigned to them. The collection's schema is as it follows:
* **title, author, description, language, published and pages:** strings and a number that represent data about the book;
* **photos:** an array that stores each uploaded photo's public_id;
* **genres:** an array that store the genres associated with the book;
* **reviews:** an array of review documents; the review schema allows for the storage of information such as the user id, content, if the eview offers spoilers, if the reviews has finished the book, the number of stars they are giving the book, the date the review was given;
* **grade:** an array that stores each review's stars;

##### Comments
The collection that saves the comments. Given that I have chosen to display the comments in a nested system, each comments has a identifier for their parent.
* **username, avatar, date, content:** strings that represent data about the comment;
* **parent_id:** the identifier that allows for nested comments;
* **book_id, user_id:** identifiers for the book and the user associated with the comment;

##### Likes
The collection that tracks the users' interaction with the reviews and the comments and it's schema:

* **user_id:** the identifier of the user that gave a like;
* **book_id:** the identifier of the book, used for deleteing purposes;
* **object_id:** the identifier of the object the user is interacting with; 

### Retrieving Data

In order to interact with the database, I have used React Query in combination with Axios. In order to make the code easier to understand and more reusable, I have written two functions for fetching and posting data:

```typescript
const fetchData = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

const postData = async (url: string, input: unknown) => {
    try {
        const response = await axios.post(url, input)
        if(!response){
            throw new Error(`Something went wrong.`)
        }
        return response.data;

    } catch (error) {
        throw new Error(`Error: ${error}`)
    }
}
```
And hooks for each api endpoint. Example of mutations and queries:
```typescript
export const useLikeMutation = () => {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (input: LikeInput) => await postData(LIKE_OBJECT, input),
    {
      onError: (error) => {
        authContext.setError(error as string);
        authContext.setOpenError(true);
      },
      onMutate: async (input: LikeInput) => {
        const context = { input };
        return context;
      },
      onSuccess: (context, variables, contextSnapshot) => {
        //Re-fetches the number of likes and check whether or not the user likes the object, so the component will be modified accordingly.
        const input: LikeInput = contextSnapshot?.input|| context?.input;
        const object_id = input?.object_id
        const user_id = input?.user_id
        queryClient.invalidateQueries(`likesCountQuery/${object_id}`);
        queryClient.invalidateQueries(
          `isLikedQuery/${user_id}/${object_id}`
        );
      },
    }
  );
 const likeLoading = mutation.isLoading;
  return {mutation, likeLoading};
};


export const useFetchLikesCount = (input: LikeInput) => {
  const authContext = useAuthContext();

  const {
    data: count,
    isLoading,
    error,
  } = useQuery(
    `likesCountQuery/${input.object_id}`,
    async () => {
      const result = await fetchData(`${COUNT_LIKES}/${input.object_id}`);
      return result;
    },
    {
      onSettled: () => {
        setTimeout(() => authContext.setOpenBackdrop(false), 0);
      },
    }
  );

  useEffect(() => {
    if (isLoading) {
      authContext.setOpenBackdrop(true);
    }
    if (error) {
      authContext.setError(error as string);
      authContext.setOpenError(true);
    }
  }, [isLoading, authContext, error]);

  return { count };
};

```

## Functionality

This app offers a rich set of features to enhance the user experience, including context management, photo uploading, writing reviews, commenting, and liking objects.

### Context

In order to manage the global state of this app, I made use of React's own useContext hook, which allows for efficient state sharing among components. The context is instrumental in storing success messages upon successful execution of queries and mutations, as well as error messages in case of failures. It also manages the loading state to provide feedback to the user during data fetching. The lobal state also helps with the authentication process. Key elements, such as the current user, the visited book or the theme are stored in the local storage.

### Uploading photos

Cloudinary is integrated into the app as a cloud-based media management service. This feature allows the future user to upload an avatar or the admin to add as many photos for a book as they need.

### Writing reviews

The user can write a single review for each book. One element I have chosen to add to the review form is whether or not the reviews has finished the book, as I consider that this feature would allow for other users to make better informed decisions when reflecting upon reading a book. The user can edit or delete their review.

### Commenting

The users can leave as many comments under any review or comment. They can delete or edit their own comments

### Liking Objects

In order to further the users interactions with eachother, I have added a liking feature. The user can like a review or comment, only once or retrieve the like.

### Reading status

The users can add the books to "shelves," such as want to read, currently reading, and read. By clicking on their avatar, a drawer will be displayed, and the user will be able to see their collections.

