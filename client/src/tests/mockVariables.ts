import { Book } from "../types/Book";

export const mockEmptyBooksData: Book[] = [];

export const mockBooksData: Book[] = [
  {
    _id: "1",
    title: "BookTitle1",
    author: "Author 1",
    thumbnail: "",
    description: "mock description",
    published: "",
    language: "English",
    genres: [],
    photos: [],
    reviews: [],
    grade: [],
    pages: 0,
  },
  {
    _id: "2",
    title: "BookTitle2",
    author: "Author 2",
    description: "mock description",
    published: "",
    thumbnail: "",
    language: "English",
    genres: [],
    photos: [],
    reviews: [],
    grade: [],
    pages: 0,
  },
];

export const mockBookCardData = {
  _id: "1",
  title: "BookTitle1",
  author: "Author 1",
  description: "mock description",
  thumbnail: "",
  published: "",
  language: "English",
  genres: [],
  photos: ["mockPhotoUrl1", "mockPhotoUrl2", "mockPhotoUrl2"],
  reviews: [],
  grade: [],
  pages: 0,
};

export const mockAdmin = {
  id: "mockedId",
  username: "mockedUsername",
  avatar: "mocked-avatar-url",
  role: "Admin",
};

export const mockUser = {
  id: "mockedSecondId",
  username: "anotherUsername",
  avatar: "another-avatar-url",
  role: "User",
};

export const mockBook = {
  _id: "1",
  title: "BookTitle1",
  author: "Author 1",
  thumbnail: "mockThumbnail",
  description: "mock description",
  published: "01/01/1990",
  language: "English",
  genres: ["adventure", "contemporary"],
  photos: ["mockUrlOne", "mockUrlTwo", "mockUrlThree"],
  reviews: [
    {
      userId: "1",
      date: "2024-05-14T17:09:28.314Z",
      content: "mockContentOne",
      stars: 3.5,
      spoilers: false,
      finished: "Finished",
      _id: "mockId1",
    },
    {
      userId: "2",
      date: "2024-05-15T17:09:28.314Z",
      content: "mockContentTwo",
      stars: 3,
      spoilers: true,
      finished: "DNF",
      _id: "mockId2",
    },
  ],
  grade: [3.5, 3],
  pages: 200,
};
