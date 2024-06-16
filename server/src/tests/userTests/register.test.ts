import { Request, Response } from "express";
import { it, expect, describe, vi, beforeEach } from "vitest";
import cloudinary from "cloudinary";
import { registrationValidationRules } from "../../middleware/validation/authValidator";
import User from "../../database/models/UserModel";
import { validate } from "../../middleware/validate";
import { registerUser } from "../../services/userService";
import { register } from "../../database/controllers/UserController";

describe("register", () => {
  vi.mock("../../services/userService.ts");
  vi.mock("cloudinary");
  vi.mock('../../config/logger.ts')
  vi.mock('../../middleware/validation/authValidator.ts')
  vi.mock('../../middleware/validate.ts')

  const req = {
    body: {
      email: "mockEmail@vitest.com",
      username: "mockUsername",
      password: "Mock#1234",
      avatar: "mock-public-id",
    },
  } as Partial<Request>;

  const mockJson = vi.fn();
  const mockStatus = vi.fn().mockReturnValue({ json: mockJson });
  const res = {
    status: mockStatus,
  } as Partial<Response>;

  const next = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    const token = "mockToken";
    const mockNewUser = {
      ...req.body,
      role: "Admin",
      currentlyReading: [],
      wantToRead: [],
      read: [],
    };
    registrationValidationRules.map((rule) => {
      vi.mocked(rule).mockReturnValue()
    })
    vi.mocked(validate).mockReturnValue(next())
    // Mock the database calls
    vi.spyOn(User, "findOne").mockResolvedValue(null);
    vi.spyOn(User, "insertMany" as never).mockResolvedValue(mockNewUser);
    vi.mocked(registerUser).mockResolvedValue(token);

    // Call the controller
    await register(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(token);
  });

  it("should handle registration errors and clean up avatar", async () => {
    const error = new Error("Registration failed");
    registrationValidationRules.map((rule) => {
      vi.mocked(rule).mockReturnValue()
    })
    vi.mocked(validate).mockReturnValue(next())
    vi.mocked(registerUser).mockRejectedValue(error);
    const destroyMock = vi.fn().mockResolvedValue({ result: "ok" });
    vi.mocked(cloudinary.v2.uploader.destroy).mockImplementation(destroyMock);

    await register(req as Request, res as Response);

    expect(destroyMock).toHaveBeenCalledWith(req.body.avatar);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ error: "Internal server error" });
  });

});
