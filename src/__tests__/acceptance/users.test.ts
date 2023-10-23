import * as request from "supertest";
import app from "../../app";
import { port } from "../../config";
import { AppDataSource } from "../../data-source";

let connection, server;

const testUser = {
  firstName: "John",
  lastName: "Doe",
  age: 34,
};

beforeEach(async () => {
  connection = await AppDataSource.initialize();
  await connection.synchronize(true);
  server = app.listen(port);
});

afterEach(() => {
  connection.close();
  server.close();
});

it("should be no users initially", async () => {
  const response = await request(app).get("/users");
  console.log(response.body);
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([]);
});

it("should create user", async () => {
  const response = await request(app).post("/users").send(testUser);
  console.log(response.body);
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ ...testUser, id: 1 });
});

it("should not create a user if no firstName is given", async () => {
  const response = await request(app)
    .post("/users")
    .send({ lastName: "Doe", age: 21 });
  expect(response.statusCode).toBe(400);
  expect(response.body.errors).not.toBeNull();
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0]).toEqual({
    type: "field",
    msg: "Invalid value",
    path: "firstName",
    location: "body",
  });

  console.log(response.body.errors);
  //   expect(response.body).toEqual({ ...testUser, id: 1 });
});

it("should not create a user if age is less than 0", async () => {
  const response = await request(app)
    .post("/users")
    .send({ firstName: "John", lastName: "Doe", age: -21 });
  expect(response.statusCode).toBe(400);
  expect(response.body.errors).not.toBeNull();
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0]).toEqual({
    type: "field",
    msg: "Age must be a positive integer",
    path: "age",
    location: "body",
    value: -21,
  });

  console.log(response.body.errors);
  //   expect(response.body).toEqual({ ...testUser, id: 1 });
});

it("simple test", () => {
  expect(1 + 1).toBe(2);
});
