const secretServiceClient = require("./secretServiceClient");
const axios = require("axios");

const mockPostSecret = jest.spyOn(axios, "post");

beforeEach(() => {
  mockPostSecret.mockClear();
  const res = Promise.resolve({
    id: "abcdefg",
  });
  mockPostSecret.mockImplementationOnce(() => res);
});

it("should return a promise.", () => {
  // Act
  const promise = secretServiceClient.postSecret();

  // Assert
  expect(promise).toBeInstanceOf(Promise);
});

it("should return a promise which is not null.", () => {
  // Act
  const promise = secretServiceClient.postSecret();

  // Assert
  expect(promise).not.toBeNull();
});

it("should post through axios once", async () => {
  // Act
  await secretServiceClient.postSecret();

  // Assert
  expect(mockPostSecret).toHaveBeenCalledTimes(1);
});

it("should return with an id field.", async () => {
  // Act
  const _ = await secretServiceClient.postSecret();

  // Assert
  expect(_).toHaveProperty("id");
});
