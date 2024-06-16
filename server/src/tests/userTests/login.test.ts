import { it, expect, describe, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import { loginUser } from "../../services/userService";
import { login } from "../../database/controllers/UserController";
import User from "../../database/models/UserModel";
import bcrypt from "bcryptjs";
import logger from "../../config/logger";

describe("testing the login post method", () => {
  vi.mock("../../services/userService.ts");
  vi.mock("cloudinary");

  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockJson: any;
  let mockStatus: any;

  beforeEach(() => {
    req = {
      body: {
        username: "mockUsername",
        password: "Mock#1234",
        rememberMe: true,
      },
    } as Partial<Request>;

    mockJson = vi.fn();
    mockStatus = vi.fn().mockReturnValue({ json: mockJson });

    res = {
      status: mockStatus,
    } as Partial<Response>;
  });
  it("should login an existing user successfully", async () => {
    try {
      const token = "mockToken";
      vi.spyOn(User, "findOne").mockResolvedValue({
        username: "test@example.com",
        password: "hashedPassword",
      });
      vi.spyOn(bcrypt, "compare").mockResolvedValue(true);
      vi.mocked(loginUser).mockResolvedValue(token);

      await login(req as Request, res as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(token);
    } catch (error) {
      logger.error(
        `Error during the testing of the login POST method: ${error}`
      );
      throw new Error(`Error during testing: ${error}`);
    }
  }, 10000);
});
