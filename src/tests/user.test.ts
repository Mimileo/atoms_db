import mongoose from 'mongoose';
import connectToDatabase from '../config/database';
import User from '../models/Users';
import { signUp, getAllUsers, findUserById, updateUser, deleteUser, getUserByEmail, getUserByUsername } from '../services/userService';

describe('User Model Test', () => {
  beforeAll(async () => {
    await connectToDatabase();
    console.log("cleaning up test user");
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a  users', async () => {
    const user = await User.create({
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'jane123',
      email: 'jane@example.com',
      password: 'password123',
      schoolName: 'Test School',
      courses: [],
      roles: ['student'],
      dob: new Date('2000-01-01'),
    });

    const user2 = await User.create({
      firstName: 'Arya',
      lastName: 'Stark',
      username: 'arya123',
      email: 'arya@example.com',
      password: 'password123',
      schoolName: 'Test School',
      courses: [],
      roles: ['student'],
      dob: new Date('2000-01-01'),
    });

    const savedUser = await User.findById(user._id);

    const savedUser2 = await User.findById(user2._id);

    expect(savedUser).toBeDefined();
    expect(savedUser.firstName).toBe('Jane');
    expect(savedUser.email).toBe('jane@example.com');

    expect(savedUser2).toBeDefined();
    expect(savedUser2.firstName).toBe('Arya');
    expect(savedUser2.email).toBe('arya@example.com');
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
