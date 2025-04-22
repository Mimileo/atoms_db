import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createFullCourse, getCourseTree, printCourseTree } from "../../services/courseService";
import Difficulty from "../../models/enums/difficulty";
import ProblemStatus from "../../models/enums/problemStatus";
import connectToDatabase from "../../config/database";



// eslint-disable-next-line @typescript-eslint/no-unused-vars
let mongo: MongoMemoryServer;

beforeAll(async () => {
 connectToDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
 
});

afterEach(async () => {
 
});

describe("Course Creation and Tree Fetch", () => {
  it("should create a course with nested content and return full course tree", async () => {
    const mockInstructorId = new mongoose.Types.ObjectId();

    const courseInput = {
      title: "Intro to CS",
      instructorId: mockInstructorId,
      description: "A test course",
      tags: ["cs", "intro"],
      steps: [
        {
          title: "Getting Started",
          order: 1,
          lectures: [
            {
              title: "Welcome",
              order: 1,
              description: "Introduction lecture",
              problems: [
                {
                  title: "Problem 1",
                  description: "Easy one",
                  difficulty: Difficulty.Easy,
                  points: 5,
                  status: ProblemStatus.Published,
                },
                {
                  title: "Problem 2",
                  description: "Hard one",
                  difficulty: Difficulty.Hard,
                  points: 15,
                  status: ProblemStatus.Published,
                  youtubeLink: "https://youtube.com/example"
                }
              ]
            }
          ]
        }
      ]
    };

    const createdCourse = await createFullCourse(courseInput);
    expect(createdCourse).toBeDefined();
    expect(createdCourse.title).toBe("Intro to CS");

    const courseTree = await getCourseTree(createdCourse._id);
    printCourseTree(courseTree); 
    expect(courseTree.steps.length).toBe(1);

    const [step] = courseTree.steps;
    expect(step.lectures.length).toBe(1);

    const [lecture] = step.lectures;
    expect(lecture.problems.length).toBe(2);
    expect(lecture.problems[0].title).toBe("Problem 1");
  });
});
