import mongoose from "mongoose";
import connectToDatabase from "../config/database";
import Course from "../models/Course";
import Step from "../models/Step";
import User from "../models/Users";
import UserStepProgress from "../models/UserStepProgress";

describe("UserStepProgress Model", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any, course: any, step: any;

  beforeAll(async () => {
    await connectToDatabase();
    user = await User.create({ 
      firstName: "Stepper", 
      lastName: "example",
      username: "ussrr3",
      email: "stepper@example.com", 
      password: "pass123", 
      schoolName: "Step School", 
      class: "11", 
      roles: ["student"], 
      dob: new Date("2004-01-01") 
    });
    course = await Course.create({ title: "Maths", description: "Algebra and more", instructorId: user._id, totalPoints: 120 });
    step = await Step.create({ courseId: course._id, title: "Step 1", order: 1, totalPoints: 20 });
  });

  afterAll(async () => {
    await User.findOneAndDelete({ email: "stepper@example.com" });
    await Course.findOneAndDelete({ title: "Maths" });
    await mongoose.disconnect();
  });

  it("should create user step progress", async () => {
    const progress = await UserStepProgress.create({
      userId: user._id,
      courseId: course._id,
      stepId: step._id,
      problemsCompleted: 5,
      totalProblems: 10,
      percentage: 50,
      completed: false
    });

    expect(progress).toBeDefined();
    expect(progress.percentage).toBe(50);
    expect(progress.completed).toBe(false);
  });
});
