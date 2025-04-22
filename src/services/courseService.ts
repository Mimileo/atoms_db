// src/services/courseService.ts
import { isValidObjectId } from "mongoose";
import Course, { ICourse } from "../models/Course";
import { createStep } from "./stepService";
import { createLecture } from "./lectureService";
import { createProblem } from "./problemService";
import mongoose from "mongoose";
import Step from "../models/Step";
import Lecture from "../models/Lecture";
import Problem from "../models/Problem";
import { DifficultyType } from "../models/enums/difficulty";
import { ProblemStatusType } from "../models/enums/problemStatus";


export type ProblemInput = {
    title: string;
    description: string;
    difficulty: DifficultyType;
    points: number;
    youtubeLink?: string;
    status: ProblemStatusType;
    courseId?: mongoose.Types.ObjectId;
  };
  
  export type LectureInput = {
    title: string;
    order: number;
    description?: string;
    problems: ProblemInput[];
  };
  
  export type StepInput = {
    title: string;
    order: number;
    lectures: LectureInput[];
    courseId?: mongoose.Types.ObjectId;
  };
  
  export type FullCourseInput = Partial<Pick<ICourse, "description" | "tags">> & {
    title: string;
    instructorId: mongoose.Types.ObjectId;
    steps: StepInput[];
  };


// For creating a new step
export type StepCreateInput = {
    courseId: mongoose.Types.ObjectId;
    title: string;
    order: number;
    totalPoints: number;
    totalProblems: number;
  };
  
  // For updating an existing step (may include _id)
  export type StepUpdateInput = {
    _id?: mongoose.Schema.Types.ObjectId;
    title: string;
    order: number;
    lectures: LectureUpdateInput[];
  };
  
  

type ProblemUpdateInput = ProblemInput & { _id?: mongoose.Schema.Types.ObjectId };
type LectureUpdateInput = LectureInput & { _id?: mongoose.Schema.Types.ObjectId; problems: ProblemUpdateInput[] };

export type FullCourseUpdateInput = Partial<Pick<ICourse, "title" | "description" | "tags">> & {
  steps: StepUpdateInput[];
};



  

  
export const getAllCourses = async () => {
    return await Course.find().lean();
}


// Get course by id
export const getCourseById = async (id: string) => {

   try {
    if(!isValidObjectId(id)) {
        return null;
    }
    const course = await Course.findById(id);
    return course;
   } catch (error) {
    console.log(error);
    return null;
   }
}


// Create full course
export async function createFullCourse(courseData: FullCourseInput) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = await Course.create([{
      title: courseData.title,
      description: courseData.description,
      instructorId: courseData.instructorId,
      tags: courseData.tags,
      totalPoints: 0,
    }], { session });

    const courseId = course[0]._id;
    let totalPoints = 0;

    for (const stepData of courseData.steps) {
      const step = await createStep({
        courseId,
        title: stepData.title,
        order: stepData.order,
        totalPoints: 0,
        totalProblems: 0,
      }, session);

      let stepPoints = 0;
      let stepProblems = 0;

      for (const lectureData of stepData.lectures) {
        const lecture = await createLecture({
          stepId: step._id,
          title: lectureData.title,
          order: lectureData.order,
          description: lectureData.description,
        }, session);

        for (const problemData of lectureData.problems) {
          await createProblem({
            courseId,
            stepId: step._id,
            lectureId: lecture._id,
            title: problemData.title,
            description: problemData.description,
            difficulty: problemData.difficulty,
            points: problemData.points,
            youtubeLink: problemData.youtubeLink,
            status: problemData.status,
          }, session);

          stepPoints += problemData.points;
          stepProblems += 1;
        }
      }

      step.totalPoints = stepPoints;
      step.totalProblems = stepProblems;
      await step.save({ session });

      totalPoints += stepPoints;
    }

    course[0].totalPoints = totalPoints;
    await course[0].save({ session });

    await session.commitTransaction();
    return course[0];
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw err;
  } finally {
    session.endSession();
  }
}



// Get course tree

export const getCourseTree = async (cId: string | string) => {
  const course = await Course.findById(cId).lean();

  if (!course) throw new Error("Course not found");

  const steps = await Step.find({ courseId: cId }).sort({ order: 1 });
  const stepsWithLectures = await Promise.all(
    steps.map(async (step) => {
      const lectures = await Lecture.find({ stepId: step._id }).sort({ order: 1 });
      const lecturesWithProblems = await Promise.all(
        lectures.map(async (lecture) => {
          const problems = await Problem.find({ lectureId: lecture._id });
          return {
            ...lecture.toObject(),
            problems: problems.map((p) => p.toObject()),
          };
        })
      );

      return {
        ...step.toObject(),
        lectures: lecturesWithProblems,
      };
    })
  );

  return {
    ...course,
    steps: stepsWithLectures,
  };
};


 // Update full course

  export async function updateFullCourse(courseId: string, updateData: FullCourseUpdateInput) {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const course = await Course.findById(courseId).session(session);
      if (!course) throw new Error("Course not found");
  
      // Update course fields
      if (updateData.title) {
        course.title = updateData.title;
       // course.save({ session });
      }
      if (updateData.description) course.description = updateData.description;
      if (updateData.tags) course.tags = updateData.tags;
      await course.save({ session });
  
      // Track all valid IDs
      const validStepIds: string[] = [];
      const validLectureIds: string[] = [];
      const validProblemIds: string[] = [];
  
      for (const stepData of updateData.steps) {
        let step;
        if (stepData._id) {
          step = await Step.findById(stepData._id).session(session);
          if (!step) throw new Error(`Step ${stepData._id} not found`);
          step.title = stepData.title;
          step.order = stepData.order;
          await step.save({ session });
        } else {
          step = await createStep({
              courseId: courseId,
              title: stepData.title,
              order: stepData.order,
              totalPoints: 0,
              totalProblems: 0,
            }, session);
        }
  
        validStepIds.push(step._id.toString());
  
        for (const lectureData of stepData.lectures) {
          let lecture;
          if (lectureData._id) {
            lecture = await Lecture.findById(lectureData._id).session(session);
            if (!lecture) throw new Error(`Lecture ${lectureData._id} not found`);
            lecture.title = lectureData.title;
            lecture.order = lectureData.order;
            lecture.description = lectureData.description;
            await lecture.save({ session });
          } else {
            lecture = await createLecture({ stepId: step._id, ...lectureData }, session);
          }
  
          validLectureIds.push(lecture._id.toString());
  
          for (const problemData of lectureData.problems) {
            let problem;
            if (problemData._id) {
              problem = await Problem.findById(problemData._id).session(session);
              if (!problem) throw new Error(`Problem ${problemData._id} not found`);
              Object.assign(problem, problemData);
              await problem.save({ session });
              validProblemIds.push(problem._id.toString());
            } else {
              const newProblem = await createProblem({
                courseId: course._id,
                stepId: step._id,
                lectureId: lecture._id,
                title: problemData.title,
                description: problemData.description,
                difficulty: problemData.difficulty,
                points: problemData.points,
                youtubeLink: problemData.youtubeLink,
                status: problemData.status,
              }, session);
              validProblemIds.push(newProblem._id.toString());
            }
          }
        }
      }
  
      // Delete steps, lectures, and problems that are not in the updated data
      await Step.deleteMany({
        courseId,
        _id: { $nin: validStepIds },
      }).session(session);
  
      await Lecture.deleteMany({
        stepId: { $nin: validStepIds },
        _id: { $nin: validLectureIds },
      }).session(session);
  
      await Problem.deleteMany({
        lectureId: { $nin: validLectureIds },
        _id: { $nin: validProblemIds },
      }).session(session);
  
      await session.commitTransaction();
      session.endSession();
  
      // Return updated course tree, including updated title
      return await getCourseTree(courseId); // Course tree includes title now
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
  


  // Print course tree
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function printCourseTree(tree: any) {
    console.log("📘 Course Tree:");
    console.dir(tree, { depth: null, colors: true });
  }
  
  