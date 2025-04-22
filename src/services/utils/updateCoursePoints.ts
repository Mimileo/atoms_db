// utils/updateCoursePoints.ts

import mongoose from "mongoose";
import Course from "../../models/Course";
import Problem from "../../models/Problem";


export const updateCoursePoints = async (courseId: mongoose.Types.ObjectId) => {
  const problems = await Problem.find({ courseId });
  const total = problems.reduce((sum, p) => sum + (p.points || 0), 0);

  const course = await Course.findByIdAndUpdate(courseId, { totalPoints: total });
  course?.save();
  return course;
};

