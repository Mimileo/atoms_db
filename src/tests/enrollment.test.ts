import mongoose from "mongoose";
import connectToDatabase from "../config/database";
import Course from "../models/Course";
import User from "../models/Users";
import Enrollment from "../models/Enrollment";
import { setupCourseProgressForUser } from "../services/utils/setUpProgress";

describe("Enrollment model", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let course: any;

  beforeAll(async () => {
    await connectToDatabase();

    // Replace with real _ids or mock them beforehand
    course = await Course.findOne({title: "Intro to CS"});
    user = await User.findOne({firstName: "Alice"});
  });

  afterAll(async () => {
   
    await mongoose.disconnect();
  });

  it("should create an enrollment", async () => {
   
    const enrollment = await Enrollment.create({
      userId: user._id,
      courseId: course._id,
      role: "student",
      status: "active",
      startDate: new Date(),
      accessCode: "abc123", // access code for the course
    });

    user.enrollments.push(enrollment._id);
    await user.save();

    await setupCourseProgressForUser(user._id, course._id);



    expect(enrollment).toBeDefined();
    expect(enrollment.userId.toString()).toBe(user._id.toString());
    expect(enrollment.courseId.toString()).toBe(course._id.toString());

    const populated = await enrollment.populate(["userId", "courseId"]);
    console.log("User:", populated.userId);
    console.log("Course:", populated.courseId);
  });
});
