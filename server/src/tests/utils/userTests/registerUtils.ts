export const token = 'mockToken'

export const invalidReqEmailMissing = {
  username: "mockUsername",
  password: "Test$1234",
  avatar: "mockPublicId",
  email: "",
};

export const invalidReqUsernameMissing = {
  username: "",
  password: "Test$1234",
  avatar: "mockPublicId",
  email: "mockEmail@testing.com",
};

export const invalidReqPasswordMissing = {
  username: "mockUsername",
  password: "",
  avatar: "mockPublicId",
  email: "mockEmail@testing.com",
};

export const invalidReqAvatarMissing = {
  username: "mockUsername",
  password: "Test$1234",
  avatar: "",
  email: "mockEmail@testing.com",
};

export const invalidReqEmailFormat={
    username: "mockUsername",
    password: "Test$1234",
    avatar: "mockPublicId",
    email: "mockInvalidEmail",
  }

  export const invalidReqUsernameShort = {
    username: "user",
    password: "Test$1234",
    avatar: "mockPublicId",
    email: "mockEmail@testing.com",
  }; 

export const invalidRequestPasswordWeak = {
  username: "mockUsername",
  password: "mockp",
  avatar: "mockPublicId",
  email: "mockEmail@testing.com",
};

export const validRequest = {
    username: "mockUsername",
    password: "hashed.Password123",
    avatar: "mockPublicId",
    email: "mockEmail@testing.com",
  };
