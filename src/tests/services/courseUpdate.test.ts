import mongoose from "mongoose";
import Problem from "../../models/Problem";
import Lecture from "../../models/Lecture";
import Course from "../../models/Course";
import Step from "../../models/Step";
import { MongoMemoryReplSet } from 'mongodb-memory-server';

import { createFullCourse, getCourseTree, updateFullCourse } from "../../services/courseService";
import Difficulty from "../../models/enums/difficulty";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ProblemStatus, { ProblemStatusType } from "../../models/enums/problemStatus";
import { FullCourseInput, FullCourseUpdateInput } from "../../services/courseService";

//let mongoServer: MongoMemoryServer;
let mongoServer: MongoMemoryReplSet;

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create({
    replSet: { count: 1 },
  });

  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create collections upfront to avoid conflict during transaction
  await Promise.all([
    Course.createCollection(),
    Step.createCollection(),
    Lecture.createCollection(),
    Problem.createCollection(),
  ]);
});





afterAll(async () => {
  await mongoose.disconnect();
  //await mongoServer.stop();
});

afterEach(async () => {
  await Promise.all([
    Course.deleteMany({}),
    Step.deleteMany({}),
    Lecture.deleteMany({}),
    Problem.deleteMany({})
  ]);
});

describe("Course Service", () => {
  it("should create, fetch, and update a course tree", async () => {
    const instructorId = new mongoose.Types.ObjectId();

    // 1. Create full course
    const courseInput: FullCourseInput = {
      title: "Intro to Testing",
      instructorId,
      tags: ["jest", "testing"],
      description: "A course to test nested structures",
      steps: [
        {
          title: "Step 1",
          order: 1,
          lectures: [
            {
              title: "Lecture 1",
              order: 1,
              description: "Intro lecture",
              problems: [
                {
                  title: "Problem 1",
                  description: "Easy problem",
                  difficulty: Difficulty.Easy,
                  points: 10,
                  status: ProblemStatus.Published,
                }
              ]
            }
          ]
        }
      ]
    };

    const course = await createFullCourse(courseInput);
    expect(course.title).toBe("Intro to Testing");

    // 2. Get course tree
    const courseTree = await getCourseTree(course._id);

    expect(course.title).toBe("Intro to Testing");
    expect(courseTree.steps).toHaveLength(1);
    expect(courseTree.steps[0].lectures).toHaveLength(1);
    expect(courseTree.steps[0].lectures[0].problems).toHaveLength(1);
   // expect(courseTree).toBe(10);

    // 3. Update the course: rename title, add a new step, delete original
    const updateData: FullCourseUpdateInput = {
      title: "Updated Course",
      steps: [
        {
          title: "New Step",
          order: 1,
          lectures: [
            {
              title: "New Lecture",
              order: 1,
              problems: [
                {
                  title: "New Problem",
                  description: "Medium problem",
                  difficulty: Difficulty.Medium,
                  points: 15,
                  status: ProblemStatus.Published
                }
              ]
            }
          ]
        }
      ]
    };

    const updatedTree = await updateFullCourse(course._id.toString(), updateData);
    
    console.log(updatedTree);
    expect(updateData.title).toBe("Updated Course");
    expect(updatedTree.steps).toHaveLength(1);
    expect(updatedTree.steps[0].title).toBe("New Step");
    expect(updatedTree.steps[0].lectures[0].title).toBe("New Lecture");
    expect(updatedTree.steps[0].lectures[0].problems[0].title).toBe("New Problem");

    const allSteps = await Step.find();
    const allLectures = await Lecture.find();
    const allProblems = await Problem.find();

    expect(allSteps.length).toBe(1); // original step removed
    expect(allLectures.length).toBe(1);
    expect(allProblems.length).toBe(1);
  });
});
