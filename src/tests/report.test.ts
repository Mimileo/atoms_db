import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Course from '../models/Course';
import Step from '../models/Step';
import Lecture from '../models/Lecture';
import Problem from '../models/Problem';
import User from '../models/Users';
import UserProblemProgress from '../models/UserProblemProgress';
import { getCourseProblemProgress } from '../services/utils/getProblemProgress';
import connectToDatabase from '../config/database';


describe('Course Progress Calculation', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
     connectToDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  
  });

  it('should calculate correct course and step progress', async () => {
    // 1. Create mock user
    const user = await User.create({ 
      firstName: 'Test2',
      lastName: 'User2',
      username: 'test124', 
      email: 'test2@example.com',
      password: 'password123',
      schoolName: 'Test High',
  
      roles: ['student'],
      dob: new Date('2000-01-01')
    });

    // 2. Create course, step, lecture, and problems
    const course = await Course.create({ title: 'Networking', totalPoints: 0 });
    const step = await Step.create({ courseId: course._id, title: 'Step 1', order: 1 });
    const lecture = await Lecture.create({ courseId: course._id, stepId: step._id, title: 'Lecture 1', order: 1 });

    const problems = await Problem.insertMany([
      { lectureId: lecture._id, title: 'P1', points: 10, status: 'published' },
      { lectureId: lecture._id, title: 'P2', points: 10, status: 'published' },
      { lectureId: lecture._id, title: 'P3', points: 10, status: 'published' },
    ]);

    // 3. Mock progress: student completes 2 of 3 problems
    await UserProblemProgress.insertMany([
      { userId: user._id, problemId: problems[0]._id, status: 'complete' },
      { userId: user._id, problemId: problems[1]._id, status: 'complete' },
    ]);

    // 4. Call progress utility
    const report = await getCourseProblemProgress(user._id.toString(), course._id.toString());

    // 5. Expect correct results
    expect(report.courseProgress).toBe(67); // 2 of 3 = 66.67% → rounded to 67
    expect(report.totalCompleted).toBe(2);
    expect(report.totalProblems).toBe(3);

    expect(report.stepProgress).toEqual([
      expect.objectContaining({
        stepId: step._id.toString(),
        progress: 67,
        completed: 2,
        total: 3,
      })
    ]);
  });
});
