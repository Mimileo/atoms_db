import Enrollment, { IEnrollment } from '../models/Enrollment';
import Course from '../models/Course';
import UserCourseProgress, { ICourseProgress } from '../models/UserCourseProgress'; // Import missing model
import mongoose from 'mongoose';
import User from '../models/Users';
import { setupCourseProgressForUser } from './utils/setUpProgress';



export const getAllEnrollments = async () => {
  try {
    const enrollments = await Enrollment.find();
    return enrollments;
  } catch (error) {
    throw new Error(`Error fetching enrollments: ${error}`);
  } 
}

export const getEnrollmentsByUserId = async (userId: mongoose.Types.ObjectId) => {
  try {
    const enrollments = await Enrollment.find({ userId });
    return enrollments;
  } catch (error) {
    throw new Error(`Error fetching enrollments: ${error}`);
  }
}


export const getEnrollmentsByCourseId = async (courseId: mongoose.Types.ObjectId) => {
  try {
    const enrollments = await Enrollment.find({ courseId });
    return enrollments;
  } catch (error) {
    throw new Error(`Error fetching enrollments: ${error}`);
  }
}


export const getEnrollmentByUserIdAndCourseId = async (userId: mongoose.Types.ObjectId, courseId: mongoose.Types.ObjectId) => {
  try {
    const enrollment = await Enrollment.findOne({ userId, courseId });
    return enrollment;
  } catch (error) {
    throw new Error(`Error fetching enrollment: ${error}`);
  }
}


export const deleteEnrollment = async (enrollmentId: string) => {
  try {

    if (!enrollmentId) {
      throw new Error('Enrollment ID is required');
    }

    if (!mongoose.isValidObjectId(enrollmentId)) {
      throw new Error('Invalid enrollment ID');
    }

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    const userId = enrollment.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.enrollments.pull(enrollmentId);
    await user.save();

    const deletedEnrollment = await Enrollment.findByIdAndDelete(enrollmentId);


    return deletedEnrollment;
  } catch (error) {
    throw new Error(`Error deleting enrollment: ${error}`);
}

}



// Enroll the student in a course
export const enrollStudent = async (userId: mongoose.Types.ObjectId, accessCode: string): Promise<IEnrollment> => {
  try {
    // Fetch the course with the provided access code
    const course = await Course.findOne({ accessCode });
    if (!course) {
      throw new Error('Course not found with the provided access code');
    }

    // Check if the user is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({ userId, courseId: course._id });
    if (existingEnrollment) {
      throw new Error('User is already enrolled in this course');
    }

    // Create a new enrollment
    const enrollment = new Enrollment({
      userId,
      courseId: course._id,
      role: 'student',
      accessCode,
    });

    await enrollment.save();

    // set up UserCourseProgress  for the student
    const courseProgress = await setupCourseProgressForUser(userId, course._id);

    await courseProgress.save();

    await User.findByIdAndUpdate(userId, {
      $push: { enrollments: enrollment._id }
    });
    
    return enrollment;
  } catch (error) {
    throw new Error(`Error enrolling student: ${error}`);
  }
};

export const trackStudentProgress = async (
  userId: mongoose.Types.ObjectId,
  courseId: mongoose.Types.ObjectId,
  earnedPoints: number,
  totalAvailablePoints: number
): Promise<ICourseProgress> => {
  try {
    let courseProgress = await UserCourseProgress.findOne({ userId, courseId });

    if (!courseProgress) {
      courseProgress = new UserCourseProgress({
        userId,
        courseId,
        totalPointsEarned: earnedPoints,
        totalPointsAvailable: totalAvailablePoints,
        percentage: (earnedPoints / totalAvailablePoints) * 100,
        completed: earnedPoints >= totalAvailablePoints,
      });
    } else {
      courseProgress.totalPointsEarned = earnedPoints;
      courseProgress.totalPointsAvailable = totalAvailablePoints;
      courseProgress.percentage = (earnedPoints / totalAvailablePoints) * 100;
      courseProgress.completed = earnedPoints >= totalAvailablePoints;
    }

    await courseProgress.save();
    return courseProgress;
  } catch (error) {
    throw new Error(`Error tracking student progress: ${error}`);
  }
};
