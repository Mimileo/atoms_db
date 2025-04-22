import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import Course from '../../models/Course';
import Step from '../../models/Step';
import Lecture from '../../models/Lecture';
import Problem from '../../models/Problem';
import { connect } from 'http2';
import connectToDatabase from '../../config/database';
import { updateCoursePoints } from '../../services/utils/updateCoursePoints';
import { access } from 'fs';

describe('Create Course with Steps, Lectures, and Problems', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    connectToDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
   // await mongoServer.stop();
  });

  it('should create a course with nested steps, lectures, and problems', async () => {
    // 1. Create the course
    const course = await Course.create({
      title: 'Intro to Networking',
      description: 'Learn networking basics step by step.',
      accessCode: 'abc123',
    });

    // 2. Create a step
    const step = await Step.create({
      courseId: course._id,
      title: 'Step 1: TCP/IP Fundamentals',
      description: 'Understanding the core networking protocol suite.',
      order: 1,
    });

    // 3. Create a lecture
    const lecture = await Lecture.create({
      courseId: course._id,
      stepId: step._id,
      title: 'Lecture: TCP vs UDP',
      description: 'Differences between TCP and UDP protocols.',
      order: 1,
    });

    // 4. Create problems for the lecture
    const problem1 = await Problem.create({
      lectureId: lecture._id,
      title: 'What is TCP?',
      description: 'Explain what TCP is and how it works.',
      difficulty: 'Easy',
      points: 10,
      status: 'published',
      courseId: course._id,
      stepId: step._id
    });

    const problem2 = await Problem.create({
      lectureId: lecture._id,
      title: 'Compare TCP and UDP',
      description: 'List three differences between TCP and UDP.',
      difficulty: 'Medium',
      points: 15,
      status: 'published',
      courseId: course._id,
      stepId: step._id
    });

    await updateCoursePoints(course._id);
    // 5. Assertions
    expect(course.title).toBe('Intro to Networking');
    expect(step.courseId.toString()).toBe(course._id.toString());
    expect(lecture.stepId.toString()).toBe(step._id.toString());

    const problems = await Problem.find({ lectureId: lecture._id });
    expect(problems).toHaveLength(2);
    expect(problems[0].lectureId.toString()).toBe(lecture._id.toString());
  });
});
