import express from "express";
import { it, expect, describe } from "vitest";
import { mongooseConfig } from "../../database/mongooseConfig";
import { fetchUserValidationRules } from "../../middleware/validation/authValidator";
import { validate } from "../../middleware/validate";
import { fetchUser } from "../../database/controllers/UserController";
import request from "supertest";
import { id } from "../utils/userTests/fetchUserUtils";

describe("/GET fetchUser", async () => {
  /**
   * Testing if using an invalid fetchUser input returns an error message;
   */
  const app = express();
  const router = express.Router();
  app.use(express.json());
  const fetchUserRoute = router.get(
    "/fetchUser/:id?",
    fetchUserValidationRules,
    validate,
    fetchUser
  );
  app.use(fetchUserRoute);
  await mongooseConfig();
  const invalidId = 1234;
  it("should return 500 if the user ID is not a string", async () => {
    const response = await request(app).get(`/fetchUser/${invalidId}`);
    expect(response.status).toBe(500);
    expect(response.body.error).toEqual("Internal server error");
  });
});
