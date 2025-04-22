import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../models/Users";
import { deleteUser, findUserById, getAllUsers, getUserByEmail, getUserByUsername, signUp, updateUser } from "../../services/userService";


let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("signUp", () => {
  it("should create a user and return it without the password", async () => {
    const data = {
      firstName: "Alice",
      lastName: "Smith",
      username: "alicesmith",
      email: "alice@example.com",
      password: "supersecure",
      roles: ["student"],
      schoolName: "Tech High",
      dob: new Date("2000-01-01"),
    };

    const user = await signUp(data);

    expect(user).toBeDefined();
    expect(user?.email).toBe(data.email);
    expect(user?.username).toBe(data.username);
    expect(user?.password).toBeUndefined(); // password should be excluded
  });

  it("should throw if email is already in use", async () => {
    const data = {
      firstName: "Bob",
      lastName: "Johnson",
      username: "bobbyj",
      email: "bob@example.com",
      password: "pass1234",
      roles: ["student"],
      dob: new Date("2000-01-01"),
    };

    await signUp(data);

    await expect(signUp({ ...data, username: "newuser" })).rejects.toThrow(
      "Email already in use."
    );
  });

  it("should throw if username is already in use", async () => {
    const data = {
      firstName: "Eve",
      lastName: "Doe",
      username: "evedoe",
      email: "eve@example.com",
      password: "password",
      roles: ["instructor"],
      dob: new Date("1990-05-05"),
    };

    await signUp(data);

    await expect(signUp({ ...data, email: "new@example.com" })).rejects.toThrow(
      "Username already in use."
    );
  });


  describe("User service", () => {
    let userId: string;
  
    const userData = {
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john@example.com",
      password: "securepass",
      roles: ["student"],
      dob: new Date("1995-05-05"),
    };
  
    beforeEach(async () => {
      const user = await signUp(userData);
      userId = user?._id.toString();
    });
  
    it("should retrieve all users", async () => {
      const users = await getAllUsers();
      expect(users.length).toBeGreaterThan(0);
      expect(users[0].email).toBe(userData.email);
      expect(users[0].password).toBeUndefined(); // Password should be excluded
    });
  
    it("should find user by ID", async () => {
      const user = await findUserById(userId);
      expect(user).toBeDefined();
      expect(user?.email).toBe(userData.email);
    });
  
    it("should update a user", async () => {
      const updated = await updateUser(userId, { firstName: "Johnny" });
      expect(updated?.firstName).toBe("Johnny");
      expect(updated?.lastName).toBe(userData.lastName);
    });
  
    it("should delete a user", async () => {
      const deleted = await deleteUser(userId);
      expect(deleted?._id.toString()).toBe(userId);
      
      const found = await findUserById(userId);
      expect(found).toBeNull();
    });
  
    it("should get user by email", async () => {
      const user = await getUserByEmail(userData.email);
      expect(user).toBeDefined();
      expect(user?.username).toBe(userData.username);
    });
  
    it("should get user by username", async () => {
      const user = await getUserByUsername(userData.username);
      expect(user).toBeDefined();
      expect(user?.email).toBe(userData.email);
    });
  });
  
});
