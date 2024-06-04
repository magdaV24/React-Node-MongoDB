import {  render, screen } from "@testing-library/react";
import { it, expect, describe, vi } from "vitest";
import { WithProviders } from "../../utils/WithProviders";
import BookCard from "../../components/book-list/BookCard";
import { mockAdmin, mockBookCardData, mockUser } from "../mockVariables";
import userEvent from "@testing-library/user-event";

describe("Book Card", () => {
  const user = userEvent.setup();

  const { mockedUseGetUser } = vi.hoisted(() => {
    return { mockedUseGetUser: vi.fn() };
  });

  vi.mock("../../hooks/useGetUser", () => ({
    default: mockedUseGetUser,
  }));

  it("should render correctly", () => {
    render(WithProviders(<BookCard book={mockBookCardData} />));
    expect(screen.getByText(mockBookCardData.title)).toBeInTheDocument();
    expect(screen.getByText(mockBookCardData.author)).toBeInTheDocument();
    screen.debug();
  });

  it("should not show the Edit and Delete buttons if the user is not an admin", () => {
    mockedUseGetUser.mockReturnValue(mockUser);
    render(WithProviders(<BookCard book={mockBookCardData} />));
    screen.debug();
  });

  it("should show the Edit and Delete buttons if the user is an admin", () => {
    mockedUseGetUser.mockReturnValue(mockAdmin);
    render(WithProviders(<BookCard book={mockBookCardData} />));
    expect(screen.getByTitle("Edit Button")).toBeInTheDocument();
    expect(screen.getByTitle("Delete Button")).toBeInTheDocument();
    screen.debug();
  });

  it('should open the editing form if the logged in user is an admin and clicks the button', async () => {
    mockedUseGetUser.mockReturnValue(mockAdmin);
    render(WithProviders(<BookCard book={mockBookCardData} />));
    const editButton = screen.getByTitle("Edit Button");

    await user.click(editButton)

    expect(screen.getByTitle("Edit Form")).toBeInTheDocument();
  })

  it('should open the deletion of a book form if the logged in user is an admin and clicks the button', async () => {
    mockedUseGetUser.mockReturnValue(mockAdmin);
    render(WithProviders(<BookCard book={mockBookCardData} />));
    const deleteButton = screen.getByTitle("Delete Button");

    await user.click(deleteButton)

    expect(screen.getByTitle("Delete Form")).toBeInTheDocument();
  })

  it("should take the user from the Home Page to the Book Page", async () => {
    render(WithProviders(<BookCard book={mockBookCardData} />));
    const link = screen.getByText(mockBookCardData.title);
    await user.click(link);
    expect(location.pathname).toBe(`/${mockBookCardData.title}`);
  screen.debug();
  });
});
