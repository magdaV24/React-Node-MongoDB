// React testing library imports
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Vitest imports
import { it, expect, describe, afterEach, beforeEach, vi } from "vitest";

// The tested component
import BookPage from "../../pages/BookPage";

// Utils
import { WithProviders } from "../../utils/WithProviders";
import { mockBook, mockUser } from "../mockVariables"; // mock variables to use during testing

// The hook to mock
import useQueryHook from "../../hooks/useQueryHook";

describe("Book Page", () => {
  const user = userEvent.setup();

  vi.mock('useLocation')

  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
  });
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

  // Mocking the hook that fetches the current user
  const { mockedUseGetUser } = vi.hoisted(() => {
    return { mockedUseGetUser: vi.fn() };
  });

  vi.mock("../../hooks/useGetUser", () => ({
    default: mockedUseGetUser,
  }));

  it("should render the Book Page and display correctly the book's information", () => {
    vi.mocked(useQueryHook).mockReturnValue({
      data: mockBook,
    });

    render(WithProviders(<BookPage id={null} />)); // No user is logged in

    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(screen.getByText(mockBook.author)).toBeInTheDocument();
    expect(screen.getByText(mockBook.description)).toBeInTheDocument();
    expect(screen.getByText(mockBook.language)).toBeInTheDocument();
    expect(screen.getByText(mockBook.published)).toBeInTheDocument();
    expect(screen.getByTitle("Genres List")).toBeInTheDocument();

    // The id is null, so no user is logged in; testing if the button that opens the review form and the reading status
    // input are not on the page

    expect(screen.queryByTitle("Add Review Button")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Reading Status")).not.toBeInTheDocument();
  });

  it("should show the Add Review Button and Reading Status Form when the a user is logged in and the Add Review form should be shown when the button is clicked", async () => {
    mockedUseGetUser.mockReturnValue(mockUser);
    vi.mocked(useQueryHook).mockReturnValue({
      data: mockBook,
    });
    render(WithProviders(<BookPage id={mockUser.id} />));

    expect(screen.queryByTitle("Add Review Button")).toBeInTheDocument();
    expect(screen.queryByTitle("Reading Status")).toBeInTheDocument();

    // Recreating the behavior of a user that clicks the Write a Review button

    const addReviewButton = screen.getByTitle("Add Review Button");
    await user.click(addReviewButton);
    await waitFor(() => {
      expect(screen.getByTitle("Review Form")).toBeInTheDocument();
    });
  });
});
