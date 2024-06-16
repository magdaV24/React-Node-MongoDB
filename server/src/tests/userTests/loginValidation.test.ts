import express from 'express'
import { it, expect, describe } from 'vitest'
import { loginValidationRules } from '../../middleware/validation/authValidator';
import { validate } from '../../middleware/validate';
import { login } from '../../database/controllers/UserController';
import { mongooseConfig } from '../../database/mongooseConfig';
import request from 'supertest'
import { invalidPasswordBool, invalidPasswordEmpty, invalidUsernameEmpty, invalidUsernameInt } from '../utils/userTests/loginUtils';

describe('/POST login', async () => {
    /**
     * Testing if invalid login inputs return an error message;
     */

    const app = express();
    const router = express.Router();
    app.use(express.json());

    const loginRoute = router.post('/login', loginValidationRules, validate, login)

    app.use(loginRoute);
    await mongooseConfig();

    it('should return 400 if username is empty', async () => {
        const response = await request(app).post('/login').send(invalidUsernameEmpty)
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Username is required.",
              }),
            ])
          );
    })

    it('should return 400 if password is empty', async () => {
        const response = await request(app).post('/login').send(invalidPasswordEmpty)
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Password is required.",
              }),
            ])
          );
    })

    it('should return 400 if username is not a string', async () => {
        const response = await request(app).post('/login').send(invalidUsernameInt)
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Username must be a string.",
              }),
            ])
          );
    })

    it('should return 400 if password is not a string', async () => {
        const response = await request(app).post('/login').send(invalidPasswordBool)
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Password must be a string.",
              }),
            ])
          );
    })
})