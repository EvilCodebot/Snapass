const authServiceClient = require("./authServiceClient");
const axios = require("axios");
const config = require("../config.json");

const mockPost = jest.spyOn(axios, "post");

beforeEach(() => {
  mockPost.mockClear();
  const res = Promise.resolve({
    access_token: "abc",
    expires_in: 1200,
  });
  mockPost.mockImplementationOnce(() => res);
});

it("should return a promise which is not null.", () => {
  // Act
  const promise = authServiceClient.getToken();

  // Assert
  expect(promise).not.toBeNull();
});

it("should return a promise.", () => {
  // Act
  const promise = authServiceClient.getToken();

  // Assert
  expect(promise).toBeInstanceOf(Promise);
});

it("should return a token with an access_token field.", async () => {
  // Act
  const token = await authServiceClient.getToken();

  // Assert
  expect(token).toHaveProperty("access_token");
});

it("the access_token field should not be empty.", async () => {
  // Act
  const token = await authServiceClient.getToken();

  // Assert
  expect(token.access_token.length).toBeGreaterThan(0);
});

it("should have an expires field.", async () => {
  // Act
  const token = await authServiceClient.getToken();

  // Assert
  expect(token).toHaveProperty("expires_in");
});

it("should post through axios once", async () => {
  // Act
  await authServiceClient.getToken();

  // Assert
  expect(mockPost).toHaveBeenCalledTimes(1);
});

it("should post through axios with config", async () => {
  // Arrange
  const { baseUrl, scope, apiKeyId, secretAccessKey } = config.authService;

  // Act
  await authServiceClient.getToken();

  // Assert
  expect(mockPost).toHaveBeenCalledWith(baseUrl, {
    scope,
    apiKeyId,
    secretAccessKey,
  });
});
