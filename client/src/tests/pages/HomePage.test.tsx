import { render, screen } from "@testing-library/react";
import { it, describe, vi, afterEach, expect, beforeEach } from "vitest";
import HomePage from "../../pages/HomePage";
import { Book } from "../../types/Book";
import { WithProviders } from "../../utils/WithProviders";

describe("Home Page", () => {
  beforeEach(()=> {
    vi.resetModules()
    vi.resetAllMocks();
  })
  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockEmptyData: Book[] = [];
  const mockData: Book[] = [
    {
      _id: "1",
      title: "BookTitle1",
      author: "Author 1",
      thumbnail: '',
      description: "",
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
      description: "",
      published: "",
      thumbnail: '',
      language: "English",
      genres: [],
      photos: [],
      reviews: [],
      grade: [],
      pages: 0,
    },
  ];

  // Mocking the useQueryHook
  const { mockedUseQueryHook } = vi.hoisted(() => ({
    mockedUseQueryHook: vi.fn(),
  }));

  vi.mock("../../hooks/useQueryHook.ts", () => ({
    default: mockedUseQueryHook,
  }));

  // Mocking the BookList component

  const mockBookList = vi.fn();
  vi.mock('../../components/BookList.tsx', ()=>({
    default: (books: Book[])=>{
      mockBookList(books);
      return <p>It works</p>
    }
  }))

  it("should render the Home Page and display an appropriate message when there are no books in the database", () => {
    mockedUseQueryHook.mockReturnValue(mockEmptyData);
    render(WithProviders(<HomePage data={mockEmptyData}/>));
    expect(
      screen.getByText("No books in the database yet!")
    ).toBeInTheDocument();
    screen.debug();
  });

  it("should render the Home Page and display the books from the database", () => {
    mockedUseQueryHook.mockReturnValue(mockData);
    render(WithProviders(<HomePage data={mockData}/>));
    const titleOne = mockData[0]?.title;
    expect(screen.getByText(titleOne!)).toBeInTheDocument();
    screen.debug()
   
  });
});
