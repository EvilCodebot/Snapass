const authServiceClient = require("./authServiceClient");
const secretServiceClient = require("./secretServiceClient");
const axios = require("axios");

const mockPost = jest.spyOn(axios, "post");
const mockGetSecret = jest.spyOn(axios, "post");
const mockPostSecret = jest.spyOn(axios, "post");

beforeEach(() => {
  mockPost.mockClear();
  const stuff = Promise.resolve({
    access_token: "abc",
    expires_in: 1200,
  });
  mockPost.mockImplementationOnce(() => stuff);

  mockGetSecret.mockClear();
  const res = Promise.resolve({
    id: "abcdefg",
    body: "hello",
  });
  mockGetSecret.mockImplementationOnce(() => res);

  mockPostSecret.mockClear();
  const hello = Promise.resolve({
    id: "abcdefg",
  });
  mockPostSecret.mockImplementationOnce(() => hello);
});

it("should return a promise.", () => {
  // Act
  const promise = secretServiceClient.getSecret();

  // Assert
  expect(promise).toBeInstanceOf(Promise);
});

it("should return a promise which is not null.", () => {
  // Act
  const promise = secretServiceClient.getSecret();

  // Assert
  expect(promise).not.toBeNull();
});
