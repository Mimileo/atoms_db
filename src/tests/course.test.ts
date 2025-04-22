// src/tests/course.test.ts
import mongoose from 'mongoose';
import connectToDatabase from '../config/database';
import User from '../models/Users';
import Course from '../models/Course';

describe('Course Model', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let instructor: any;

  beforeAll(async () => {
    await connectToDatabase();
    instructor = await User.create({
      firstName: 'Jon',
      lastName: "Snow",
      username: "JSnow",
      email: 'instructor@example.com',
      password: 'password123',
      schoolName: 'Test School',
      class: '10A',
      roles: ['instructor'],
      dob: new Date('1990-01-01'),
    });
  });

  afterAll(async () => {
    await User.findOneAndDelete({ email: 'instructor@example.com' });
    await Course.findOneAndDelete({ title: 'C++ Mastery' });
    await mongoose.disconnect();
  });

  it('should create a course', async () => {
    const course = await Course.create({
      title: 'C++ Mastery',
      description: 'Learn C++ step by step',
      instructorId: instructor._id,
      totalPoints: 455,
    });

    expect(course).toBeDefined();
    expect(course.title).toBe('C++ Mastery');
  });
});
