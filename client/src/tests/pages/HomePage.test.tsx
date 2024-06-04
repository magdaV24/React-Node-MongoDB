import { render, screen } from "@testing-library/react";
import { it, describe, vi, afterEach, expect, beforeEach } from "vitest";
import HomePage from "../../pages/HomePage";
import { WithProviders } from "../../utils/WithProviders";
import { mockBooksData, mockEmptyBooksData } from "../mockVariables";
import useQueryHook from "../../hooks/useQueryHook";

describe("Home Page", () => {
  beforeEach(()=> {
    vi.resetModules()
    vi.resetAllMocks();
  })
  afterEach(() => {
    vi.resetAllMocks();
  });

  // Mocking the useQueryHook
  const { mockedUseQueryHook } = vi.hoisted(() => ({
    mockedUseQueryHook: vi.fn(),
  }));

  vi.mock("../../hooks/useQueryHook.ts", () => ({
    default: mockedUseQueryHook,
  }));

  it("should render the Home Page and display an appropriate message when there are no books in the database", () => {
    vi.mocked(useQueryHook).mockReturnValue({
      data: mockEmptyBooksData
    })
    render(WithProviders(<HomePage />));
    expect(
      screen.getByText("No books in the database yet!")
    ).toBeInTheDocument();
    screen.debug();
  });

  it("should render the Home Page and display the books from the database", () => {
    vi.mocked(useQueryHook).mockReturnValue({data: mockBooksData});
    render(WithProviders(<HomePage />));
    const titleOne = mockBooksData[0]?.title;
    expect(screen.getByText(titleOne!)).toBeInTheDocument()
    screen.debug()
  });
});
