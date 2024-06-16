import { beforeEach, describe, expect, it, vi } from "vitest";
import {Response, Request} from 'express'
import { findUser } from "../../services/userService";
import { fetchUser } from "../../database/controllers/UserController";
describe("/GET fetchUser", async () => {
  /**
   * Testing if the fetchUser controller fetches the user correctly
   */
  vi.mock('../../services/userService.ts')
  vi.mock('../../config/logger')
  const req = {
    params: {
      id: 'mockId'
    },
  } as Partial<Request>;

  const mockJson = vi.fn();
  const mockStatus = vi.fn().mockReturnValue({ json: mockJson });
  const res = {
    status: mockStatus,
  } as Partial<Response>;

  beforeEach(()=>{
    vi.clearAllMocks()
  });

  it("should correctly fetch the user", async () => {

    const fetchedUser={
      avatar: "mockPublicId",
      currentlyReading: [],
      email: "mockemail@test.com",
      password: "m0ck.Pa$$word",
      read: [],
      role: "Admin",
      username: "MockUsername",
      wantToRead: [],
      _id: 'someId',
    }
    vi.mocked(findUser).mockResolvedValue(fetchedUser)

    await fetchUser(req as Request, res as Response);
    expect(mockStatus).toHaveBeenCalledWith(200)
    expect(mockJson).toHaveBeenCalledWith(fetchedUser);

  });
});
