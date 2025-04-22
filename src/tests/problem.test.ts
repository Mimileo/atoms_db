import mongoose from "mongoose";
import connectToDatabase from "../config/database";
import Lecture from "../models/Lecture";
import Problem from "../models/Problem";

describe("Problem Model", () => {
  let lectureId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await connectToDatabase();
    const lecture = await Lecture.create({
      stepId: new mongoose.Types.ObjectId(),
      title: "Mock Lecture",
      order: 1,
      description: "Intro",
    });
    lectureId = lecture._id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("should create a problem", async () => {
    const problem = await Problem.create({
      lectureId,
      title: "What is a Variable?",
      description: "Define a variable in C++",
      difficulty: "Easy",
      points: 5,
    });

    expect(problem).toBeDefined();
    expect(problem.points).toBe(5);
  });
});
