import express from "express";
import { register } from "ts-node";
import { describe, it, expect } from "vitest";
import { validate } from "../../middleware/validate";
import { registrationValidationRules } from "../../middleware/validation/authValidator";
import request from "supertest";
import {
  invalidReqAvatarMissing,
  invalidReqEmailFormat,
  invalidReqEmailMissing,
  invalidReqPasswordMissing,
  invalidReqUsernameMissing,
  invalidReqUsernameShort,
  invalidRequestPasswordWeak,
} from "../utils/userTests/registerUtils";
import { mongooseConfig } from "../../database/mongooseConfig";

describe("/POST register", async () => {
  /**
   * Testing if invalid inputs return errors
   */
  const app = express();
  const router = express.Router();
  app.use(express.json());
  const registerRoute = router.post(
    "/register",
    registrationValidationRules,
    validate,
    register
  );
  app.use(registerRoute);

  await mongooseConfig();
  it("should return 400 if email is empty", async () => {
    const response = await request(app)
      .post("/register")
      .send(invalidReqEmailMissing);
    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Email is required.",
        }),
      ])
    );
  });

  it("should return 400 if username is empty", async () => {
    const response = await request(app)
      .post("/register")
      .send(invalidReqUsernameMissing);
    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Username is required.",
        }),
      ])
    );
  });

  it("should return 400 if password is empty", async () => {
    const response = await request(app)
      .post("/register")
      .send(invalidReqPasswordMissing);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Password is required.",
        }),
      ])
    );
  });

  it("should return 400 if avatar is empty", async () => {
    const response = await request(app)
      .post("/register")
      .send(invalidReqAvatarMissing);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Avatar is required.",
        }),
      ])
    );
  });

  it("should return 400 if email is not valid", async () => {
    const response = await request(app)
      .post("/register")
      .send(invalidReqEmailFormat);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Please provide a valid email address!",
        }),
      ])
    );
  });

  it("should return 400 if username is too short", async () => {
    const response = await request(app)
      .post("/register")
      .send(invalidReqUsernameShort);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Username must be at least 6 characters long",
        }),
      ])
    );
  });

  it("should return 400 if password is weak", async () => {
    const response = await request(app)
      .post("/register")
      .send(invalidRequestPasswordWeak);
    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Password must contain at least one uppercase letter, one number, and one special character (! . @ # $ % ^ & *).",
        }),
      ])
    );
  });
});
