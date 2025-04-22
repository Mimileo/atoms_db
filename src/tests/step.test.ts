// src/tests/step.test.ts
import mongoose from 'mongoose';
import connectToDatabase from '../config/database';
import Course from '../models/Course';
import Step from '../models/Step';

describe('Step Model', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let course: any;

  beforeAll(async () => {
    await connectToDatabase();
    course = await Course.create({
      title: 'Test Course',
      description: 'Test',
      instructorId: new mongoose.Types.ObjectId(),
      totalPoints: 100,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('should create a step', async () => {
    const step = await Step.create({
      courseId: course._id,
      title: 'Step 1',
      order: 1,
      totalPoints: 50,
    });

    expect(step.title).toBe('Step 1');
  });
});
