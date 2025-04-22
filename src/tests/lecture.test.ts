import mongoose from "mongoose";
import connectToDatabase from "../config/database";
import Lecture from "../models/Lecture";
import Step from "../models/Step";

describe("Lecture Model", () => {
  let stepId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await connectToDatabase();
    const step = await Step.create({
      courseId: new mongoose.Types.ObjectId(),
      title: "Mock Step",
      order: 1,
      totalPoints: 20,
    });
    stepId = step._id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("should create a lecture", async () => {
    const lecture = await Lecture.create({
      stepId,
      title: "Lecture 1",
      order: 1,
      description: "Basics",
    });

    expect(lecture).toBeDefined();
    expect(lecture.title).toBe("Lecture 1");
  });
});
