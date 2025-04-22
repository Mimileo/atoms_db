import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../models/Users';
import Course from '../../models/Course';
import Step from '../../models/Step';
import Problem from '../../models/Problem';
import UserStepProgress from '../../models/UserStepProgress';
import UserProblemProgress from '../../models/UserProblemProgress';
import UserCourseProgress from '../../models/UserCourseProgress';
import {
  initializeUserProgress,
  updateProblemProgress
} from '../../services/userProgressService';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Step.deleteMany({}),
    Problem.deleteMany({}),
    UserCourseProgress.deleteMany({}),
    UserStepProgress.deleteMany({}),
    UserProblemProgress.deleteMany({})
  ]);
});

describe('User Progress Service', () => {
 
  it('should update problem progress and cascade to step and course progress', async () => {
    const user = await User.create({
      firstName: 'Update',
      lastName: 'Problem',
      username: 'updateprob',
      email: 'update@example.com',
      password: 'Password123!',
      schoolName: 'Progress U',
      dob: new Date(),
      roles: ['student'],
      enrollments: []
    });

    const course = await Course.create({
      name: 'Cascade Updates',
      accessCode: 'CASC101',
      description: 'Cascade Updates',
      instructorId: user._id,
      totalPoints: 100,
      title: 'Cascade Updates'
    });

    const step = await Step.create({
      courseId: course._id,
      title: 'Cascade Step',
      order: 1,
      totalProblems: 1
    });

    const problem = await Problem.create({
      stepId: step._id,
      title: 'Only Problem',
      points: 5
    });

    await initializeUserProgress(user._id, course._id);

    await updateProblemProgress(user._id, course._id, step._id, problem._id, 5);

    const updatedProblem = await UserProblemProgress.findOne({
      userId: user._id,
      problemId: problem._id
    });

    expect(updatedProblem?.status).toBe('Completed');
    expect(updatedProblem?.pointsEarned).toBe(5);

    const updatedStep = await UserStepProgress.findOne({
      userId: user._id,
      stepId: step._id
    });

    expect(updatedStep?.completed).toBe(true);
    expect(updatedStep?.percentage).toBe(100);

    const updatedCourse = await UserCourseProgress.findOne({
      userId: user._id,
      courseId: course._id
    });

    expect(updatedCourse?.completed).toBe(true);
    expect(updatedCourse?.totalPointsEarned).toBe(5); // updated from 1 to 5
  });
});
