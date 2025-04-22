import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User, { IUser } from '../../models/Users';
import UserRole from '../../models/enums/userRole';
import { connect } from 'http2';
import connectToDatabase from '../../config/database';


describe('User model', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    connectToDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
   
  });

  afterEach(async () => {
   // await User.deleteMany({});
  });

  it('should hash password before saving', async () => {
    const user = new User({
      firstName: 'Alice',
      lastName: 'Smith',
      username: 'alicesmith',
      email: 'alice@example.com',
      password: 'plaintextpassword',
      dob: new Date('2000-01-01'),
      roles: UserRole.Student,
    });

    await user.save();

    const savedUser = await User.findOne({ email: 'alice@example.com' });
  
    // Ensure document and method exists
    expect(savedUser).toBeTruthy();
    expect(typeof savedUser?.comparePassword).toBe('function');
  
    const isMatch = await savedUser!.comparePassword('plaintextpassword');
    expect(isMatch).toBe(true);
  });

  it('should not re-hash password if not modified', async () => {
    const user = new User({
      firstName: 'Bob',
      lastName: 'Brown',
      username: 'bobbrown',
      email: 'bob@example.com',
      password: 'secure123',
      dob: new Date('1995-05-05'),
      roles: ['student'],
    });

    await user.save();
    const originalHashed = user.password;

    // Simulate update without changing password
    user.username = 'bobbybrown';
    await user.save();

    // Password should remain the same
    expect(user.password).toBe(originalHashed);
  });
});
