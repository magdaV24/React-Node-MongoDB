const port = 8080;
const host = `http://localhost:${port}`

export const REGISTER = `${host}/register`;
export const LOGIN = `${host}/login`;
export const FETCH_USER = `${host}/fetchUser`;
export const ADD_READING_STATUS = `${host}/addReadingStatus`
export const FIND_READING_STATUS = `${host}/findReadingStatus`
export const CHANGE_READING_STATUS = `${host}/changeReadingStatus`
export const FETCH_DRAWER_BOOKS = `${host}/fetchDrawerBooks`

export const ADD_BOOK = `${host}/addBook`;
export const FETCH_BOOKS = `${host}/fetchBooks`;
export const FETCH_BOOK = `${host}/fetchBook`;
export const ADD_PHOTO = `${host}/addPhoto`;
export const DELETE_PHOTO = `${host}/deletePhoto`;
export const EDIT_FIELDS = `${host}/editFields`;
export const DELETE_BOOK = `${host}/deleteBook`;

export const ADD_REVIEW = `${host}/addReview`
export const FETCH_REVIEWS = `${host}/fetchReviews`
export const SORT_FINISHED = `${host}/sortFinished`
export const SORT_STARS = `${host}/sortStars`
export const DELETE_REVIEW = `${host}/deleteReview`;
export const EDIT_REVIEW = `${host}/editReview`;


export const ADD_COMMENT = `${host}/addComment`;
export const EDIT_COMMENT = `${host}/editComment`;
export const FETCH_COMMENTS = `${host}/fetchComments`;
export const DELETE_COMMENT = `${host}/deleteComment`;

export const SEARCH = `${host}/search`;

export const LIKE_OBJECT = `${host}/like`;
export const CHECK_IF_LIKED = `${host}/checkIfLiked`;
export const COUNT_LIKES = `${host}/countLikes`;