import mongoose from "mongoose";
import connectToDatabase from "../config/database";
import Course from "../models/Course";
import Lecture from "../models/Lecture";
import Problem from "../models/Problem";
import Step from "../models/Step";
import UserProblemProgress from "../models/UserProblemProgress";
import User from "../models/Users";

describe("UserProblemProgress Model", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any, course: any, step: any, lecture: any, problem: any;

  beforeAll(async () => {
    await connectToDatabase();
    user = await User.create({
        firstName: "Test",
        lastName: "User",
        username: "test123",
         email: "test@example.com", 
         password: "pass123", 
         schoolName: "Test High", 
         class: "10", 
         roles: ["student"], 
         dob: new Date("2005-01-01") 
        });
    course = await Course.create({ title: "DSA", description: "Learn DSA", instructorId: user._id, totalPoints: 100 });
    step = await Step.create({ courseId: course._id, title: "Step 1", order: 1, totalPoints: 10 });
    lecture = await Lecture.create({ stepId: step._id, title: "Lecture 1", order: 1, description: "Intro" });
    problem = await Problem.create({ lectureId: lecture._id, title: "Easy Problem", description: "Solve this", difficulty: "Easy", points: 10 });
  });

  afterAll(async () => {
    await User.findOneAndDelete({ email: "test@example.com" });
    await Course.findOneAndDelete({ title: "DSA" });
    await mongoose.disconnect();
  });

  it("should create user problem progress", async () => {
    const progress = await UserProblemProgress.create({
      userId: user._id,
      courseId: course._id,
      stepId: step._id,
      lectureId: lecture._id,
      problemId: problem._id,
      status: "Completed",
      pointsEarned: 10,
      completedAt: new Date()
    });

    expect(progress).toBeDefined();
    expect(progress.status).toBe("Completed");
    expect(progress.pointsEarned).toBe(10);
  });
});
