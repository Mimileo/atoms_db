import UserCourseProgress from '../../models/UserCourseProgress';
import Problem from '../../models/Problem';
import Lecture from '../../models/Lecture';
import mongoose from 'mongoose';

export const setupCourseProgressForUser = async (userId: mongoose.Types.ObjectId, courseId: mongoose.Types.ObjectId) => {
  // 1. Get all lectures for the course
  const lectures = await Lecture.find({ courseId }).select('_id');
  const lectureIds = lectures.map((l) => l._id);

  // 2. Get all problems associated with those lectures
  const problems = await Problem.find({ lectureId: { $in: lectureIds } });

  // 3. Create user course progress
  const userCourseProgress = await UserCourseProgress.create({
    userId,
    courseId,
    totalProblems: problems.length,
    // get total points from problems
    totalPointsAvailable: problems.reduce((total, p) => total + (p.points || 0), 0),
    completedProblems: 0,
    progressPercentage: 0,
  });

  return userCourseProgress;
};
