import mongoose from 'mongoose';
import Course from '../../models/Course';
import Problem from '../../models/Problem';
import connectToDatabase from '../../config/database';
import { updateCoursePoints } from '../../services/utils/updateCoursePoints';

describe('Create Course with Steps, Lectures, and Problems', () => {

  beforeAll(async () => {
    connectToDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
   // await mongoServer.stop();
  });

  it('should create a course with nested steps, lectures, and problems', async () => {
   const course = await Course.findById('680423231b4873a77727d7ff');



   expect(course).toBeDefined();
 
  });


  it('should create a course with nested steps, lectures, and problems', async () => {
    const course = await Course.findOne({ accessCode: 'abc123' });

    const problems = await Problem.find({ courseId: course._id });
    expect(problems).toHaveLength(2);
    expect(problems[0].lectureId.toString()).toBe(course._id.toString());

    const courseTotalPoints = await updateCoursePoints(course._id);
    expect(courseTotalPoints?.totalPoints).toBe(25);
 
 
 
    expect(course).toBeDefined();
  
   });
});
