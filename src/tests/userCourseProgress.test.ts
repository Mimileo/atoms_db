import mongoose from "mongoose";
import connectToDatabase from "../config/database";
import Course from "../models/Course";
import UserCourseProgress from "../models/UserCourseProgress";
import User from "../models/Users";

describe("UserCourseProgress Model", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let course: any;

  beforeAll(async () => {
    await connectToDatabase();
    user = await User.create({ 
      firstName: "Alice", 
      lastName: "Smith", 
      username: "alice123",
      email: "alice@example.com", 
      password: "pass123", 
      schoolName: "Test High", 
      class: "12", 
      roles: ["student"], 
      dob: new Date("2000-01-01")
     });
    course = await Course.create({ title: "Test Course", description: "Course desc", instructorId: user._id, totalPoints: 200 });
  });

  afterAll(async () => {
    await User.findOneAndDelete({ _id: user._id});
    await Course.findOneAndDelete({ _id: course._id});
    await mongoose.disconnect();
  });

  it("should create user course progress", async () => {
    const progress = await UserCourseProgress.create({
      userId: user._id,
      courseId: course._id,
      percentage: 0,
      completed: false
    });

    expect(progress).toBeDefined();
    expect(progress.userId).toEqual(user._id);
    expect(progress.courseId).toEqual(course._id);
  });
});
