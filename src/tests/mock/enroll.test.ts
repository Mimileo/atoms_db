import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../models/Users';
import Course from '../../models/Course';
import Enrollment from '../../models/Enrollment';
import UserCourseProgress from '../../models/UserCourseProgress';
import {  trackStudentProgress } from '../../services/enrollmentService';
import { title } from 'process';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Enrollment.deleteMany({}),
    UserCourseProgress.deleteMany({})
  ]);
});

 

describe('trackStudentProgress', () => {
  it('should create and update progress', async () => {
    const user = await User.create({
      firstName: 'Track',
      lastName: 'Tester',
      username: 'tracktest',
      email: 'track@test.com',
      password: 'Password123!',
      schoolName: 'Progress School',
      dob: new Date('2000-01-01'),
      roles: ['student'],
      enrollments: []
    });

    const course = await Course.create({
      name: 'Tracking 101',
      accessCode: 'TRK123',
      instructorId: user._id,
      totalPoints: 455,
      status: 'active',
      tags: [],
      title: 'Tracking 101',

    });

    const progress = await trackStudentProgress(user._id, course._id, 30, 50);
    expect(progress.totalPointsEarned).toBe(30);
    expect(progress.totalPointsAvailable).toBe(50);
    expect(progress.percentage).toBe(60);
    expect(progress.completed).toBe(false);

    const updated = await trackStudentProgress(user._id, course._id, 50, 50);
    expect(updated.completed).toBe(true);
  });
});
