import mongoose from 'mongoose';
import connectToDatabase from '../../config/database';
import Course from '../../models/Course';
import Enrollment from '../../models/Enrollment';
import User from '../../models/Users';
import UserCourseProgress from '../../models/UserCourseProgress';
import { enrollStudent } from '../../services/enrollmentService';

describe('enrollStudent service', () => {
  let userId: mongoose.Types.ObjectId;
  let instructorId: mongoose.Types.ObjectId;
  let courseId: mongoose.Types.ObjectId;
  let accessCode: string;

  beforeAll(async () => {
    await connectToDatabase();

    // Create instructor
    const instructor = await User.create({
      firstName: 'Instructor',
      lastName: 'One',
      roles: ['instructor'],
      username: 'instructor123',
      email: 'instructor@example.com',
      password: 'securepassword',
      dob: new Date('1985-05-15'),
      schoolName: 'Test High School',
      class: 'Faculty',
    });
    instructorId = instructor._id;

    // Create mock course with instructor
    const course = await Course.create({
      title: 'Test Course',
      description: 'A sample course',
      accessCode: 'ENROLL123',
      instructorId, // REQUIRED field
    });
    courseId = course._id;
    accessCode = course.accessCode;

    // Create mock student
    const user = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      username: 'john123',
      email: 'john-enroll@example.com',
      password: 'securepassword',
      dob: new Date('2000-01-01'),
      schoolName: 'Test High School',
      class: '12A',
    });
    userId = user._id;
  });

  afterAll(async () => {
    await Enrollment.deleteMany({});
    await Course.deleteMany({});
    await UserCourseProgress.deleteMany({});
    await User.deleteMany({ email: { $in: ['john-enroll@example.com', 'instructor@example.com', 'jane-enroll@example.com'] } });
    await mongoose.disconnect();
  });

  it('should enroll a student using access code', async () => {
    const enrollment = await enrollStudent(userId, accessCode);

    expect(enrollment).toBeDefined();
    expect(enrollment.userId.toString()).toBe(userId.toString());
    expect(enrollment.courseId.toString()).toBe(courseId.toString());
    expect(enrollment.role).toBe('student');
    expect(enrollment.accessCode).toBe(accessCode);

    const progress = await UserCourseProgress.findOne({ userId, courseId });
    expect(progress).toBeDefined();
    expect(progress?.progress).toBe(0);
  });

  it('should not enroll the same student twice', async () => {
    await expect(enrollStudent(userId, accessCode)).rejects.toThrow(
      'User is already enrolled in this course'
    );
  });

  it('should throw error if course not found with given access code', async () => {
    const fakeUser = await User.create({
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'jane123',
      email: 'jane-enroll@example.com',
      password: 'securepassword',
      dob: new Date('2001-02-02'),
      schoolName: 'Test High School',
      class: '11B',
    });

    await expect(enrollStudent(fakeUser._id, 'WRONGCODE')).rejects.toThrow(
      'Course not found with the provided access code'
    );

    await fakeUser.deleteOne();
  });
});
