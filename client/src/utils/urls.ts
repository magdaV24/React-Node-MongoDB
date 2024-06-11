const SERVER_PORT = 8080;
const BASE_URL = `http://localhost:${SERVER_PORT}`

export const REGISTER = `${BASE_URL}/register`;
export const LOGIN = `${BASE_URL}/login`;
export const FETCH_USER = `${BASE_URL}/fetchUser`;
export const ADD_READING_STATUS = `${BASE_URL}/addReadingStatus`
export const FIND_READING_STATUS = `${BASE_URL}/findReadingStatus`
export const CHANGE_READING_STATUS = `${BASE_URL}/changeReadingStatus`
export const FETCH_DRAWER_BOOKS = `${BASE_URL}/fetchDrawerBooks`

export const ADD_BOOK = `${BASE_URL}/addBook`;
export const FETCH_BOOKS = `${BASE_URL}/fetchBooks`;
export const FETCH_BOOK = `${BASE_URL}/fetchBook`;
export const ADD_PHOTO = `${BASE_URL}/addPhoto`;
export const DELETE_PHOTO = `${BASE_URL}/deletePhoto`;
export const EDIT_BOOK = `${BASE_URL}/editBook`;
export const DELETE_BOOK = `${BASE_URL}/deleteBook`;

export const ADD_REVIEW = `${BASE_URL}/addReview`
export const FETCH_REVIEWS = `${BASE_URL}/fetchReviews`
export const SORT_FINISHED = `${BASE_URL}/sortFinished`
export const SORT_STARS = `${BASE_URL}/sortStars`
export const DELETE_REVIEW = `${BASE_URL}/deleteReview`;
export const EDIT_REVIEW = `${BASE_URL}/editReview`;


export const ADD_COMMENT = `${BASE_URL}/addComment`;
export const EDIT_COMMENT = `${BASE_URL}/editComment`;
export const FETCH_COMMENTS = `${BASE_URL}/fetchComments`;
export const DELETE_COMMENT = `${BASE_URL}/deleteComment`;

export const SEARCH = `${BASE_URL}/search`;

export const LIKE_OBJECT = `${BASE_URL}/like`;
export const CHECK_IF_LIKED = `${BASE_URL}/checkIfLiked`;
export const COUNT_LIKES = `${BASE_URL}/countLikes`;