import { render, screen } from "@testing-library/react";
import { it, expect, describe } from "vitest";
import { WithProviders } from "../../utils/WithProviders";
import BookCard from "../../components/book-list/BookCard";
const mockData = {
  _id: "1",
  title: "BookTitle1",
  author: "Author 1",
  description: "",
  thumbnail: '',
  published: "",
  language: "English",
  genres: [],
  photos: ['mockPhotoUrl1', 'mockPhotoUrl2', 'mockPhotoUrl2'],
  reviews: [],
  grade: [],
  pages: 0,
};

describe("Book Card", () => {
  it("should render correctly", () => {});
    render(WithProviders(<BookCard book={mockData}/>))
    screen.debug()
});
