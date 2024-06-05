// React  Testing Library imports
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Vitest imports
import { it, describe, vi, expect, afterEach } from "vitest";

// The tested component
import Navbar from "../../components/Navbar/Navbar";

// Utils
import { WithProviders } from "../../utils/WithProviders";
import { mockAdmin, mockUser } from "../mockVariables"; // mock variables to use during testing

describe("Navbar component", () => {

  // Setting an "user" to mimic the interactions a real user could have with the application
  const user = userEvent.setup();

  // Resetting all mocks after each test
  afterEach(() => {
    vi.resetAllMocks();
  });

  // Mocking the hook that fetches the current user
  const { mockedUseGetUser } = vi.hoisted(() => {
    return { mockedUseGetUser: vi.fn() };
  });

  vi.mock("../../hooks/useGetUser", () => ({
    default: mockedUseGetUser,
  }));

  it("renders correctly with user logged in, showing the username button", () => {
    // Mocking a logged in user ith an "Admin" role
    mockedUseGetUser.mockReturnValue(mockAdmin);

    // Rendering the Navbar component wrapped inside all the providers
    render(WithProviders(<Navbar id={mockAdmin.id} />));
    expect(screen.getByText(mockAdmin.username)).toBeInTheDocument();
  });

  it("should open the user dropdown when the username button is clicked and if the user is an admin, it should open the modal that contains the Add Book Form", async () => {
    mockedUseGetUser.mockReturnValue(mockAdmin);
    render(WithProviders(<Navbar id={mockAdmin.id} />));

    // Mimicking the behavior of a user clicking on their name
    const usernameButton = screen.getByText(mockAdmin.username);

    await user.click(usernameButton);
    const addBook = screen.getByText("Add Book");
    expect(addBook).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();

    // Testing if the book form appears on the screen when the "Add Button" is clicked
    await userEvent.click(addBook);

    await waitFor(() => {
      const addBookHeader = screen.getByTitle("Add Book Form");
      expect(addBookHeader).toBeInTheDocument();
    });
  });

  it('should not show the "Add Book" button when the user is not an admin', async () => {
    mockedUseGetUser.mockReturnValue(mockUser); //The logged in user has a "User" role
    render(WithProviders(<Navbar id={mockUser.id} />));
    const usernameButton = screen.getByText(mockUser.username);

    // Testing if the "Add Book" button is not present when the user is not an admin
    await user.click(usernameButton);
    const addBook = screen.queryByText("Add Book");
    expect(addBook).toBeNull();
  });

  it("should display the Login and Register buttons if the user is not logged in and show the Login and Register forms when their associated buttons are clicked", async () => {
    render(WithProviders(<Navbar id={null} />)); // No logged in user;
    const loginButton = screen.getByText("Login");
    const registerButton = screen.getByText("Register");

    expect(loginButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();

    await user.click(loginButton);

    const loginHeader = screen.getByTitle("Login Form");
    expect(loginHeader).toBeInTheDocument();

    await user.click(registerButton);
    const registerHeader = screen.getByTitle("Register Form");
    expect(registerHeader).toBeInTheDocument();
  });
});
