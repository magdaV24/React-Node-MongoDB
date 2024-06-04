import { it, describe, vi, expect, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Navbar from "../../components/Navbar/Navbar";
import { WithProviders } from "../../utils/WithProviders";
import userEvent from "@testing-library/user-event";
import { mockAdmin, mockUser } from "../mockVariables";

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

    mockedUseGetUser.mockReturnValue(mockAdmin);

    render(WithProviders(<Navbar id={mockAdmin.id} />));
    expect(screen.getByText(mockAdmin.username)).toBeInTheDocument();
    screen.debug();
  });

  it("should open the user dropdown when the username button is clicked and if the user is an admin, it should open the modal that contains the Add Book Form", async () => {
    mockedUseGetUser.mockReturnValue(mockAdmin);
    render(WithProviders(<Navbar id={mockAdmin.id} />));
    const usernameButton = screen.getByText(mockAdmin.username);
    await user.click(usernameButton);

    const addBook = screen.getByText("Add Book");
    expect(addBook).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();

    await userEvent.click(addBook);

    screen.debug();

    await waitFor(() => {
      const addBookHeader = screen.getByTitle("Add Book Form");
      expect(addBookHeader).toBeInTheDocument();
    });
    screen.debug();
  });

  it('should not show the "Add Book" button when the user is not an admin', async () => {
    mockedUseGetUser.mockReturnValue(mockUser);
    render(WithProviders(<Navbar id={mockUser.id} />));
    const usernameButton = screen.getByText(mockUser.username);

    await user.click(usernameButton);
    const addBook = screen.queryByText("Add Book");
    expect(addBook).toBeNull();
    screen.debug();
  });

  it("should display the Login and Register buttons if the user is not logged in and show the Login and Register forms when their associated buttons are clicked", async () => {
    render(WithProviders(<Navbar id={null} />));
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
    screen.debug();
  });
});
