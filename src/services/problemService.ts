import Problem, { IProblem } from "../models/Problem";
import mongoose from "mongoose";

export type ProblemInput = Pick<IProblem, "courseId" | "stepId" | "lectureId" | "title" | "description" | "difficulty" | "points" | "youtubeLink" | "status">;

export const createProblem = async (data: ProblemInput, session?: mongoose.ClientSession) => {
    const problem = await Problem.create([data], session ? { session } : {});
    return problem[0];
  };
  

export const getAllProblems = async () => {
  return await Problem.find().lean();
};

export const getProblemsByLectureId = async (lectureId: string | mongoose.Types.ObjectId) => {
  return await Problem.find({ lectureId });
};

export const getProblemsByLectureIds = async (lectureIds: (string | mongoose.Types.ObjectId)[]) => {
  return await Problem.find({ lectureId: { $in: lectureIds } });
};

export const updateProblem = async (id: string, data: Partial<IProblem>) => {
  return await Problem.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const deleteProblem = async (id: string) => {
  return await Problem.findByIdAndDelete(id).lean();
};

export const getProblemById = async (id: string) => {
  return await Problem.findById(id).lean();
};

export const getProblemByLectureId = async (lectureId: string | mongoose.Types.ObjectId) => {
  return await Problem.findOne({ lectureId }).lean();
};


export const upsertProblem = async (
    data: Partial<IProblem> & { stepId: string; lectureId: string; courseId: string },
    session?: mongoose.ClientSession
  ) => {
    if (data._id) {
      return await updateProblem(data._id.toString(), data);
    } else {
      return await createProblem(data as ProblemInput, session);
    }
  };
  

  export const deleteProblemsNotIn = async (lectureId: string, validIds: string[]) => {
    return await Problem.deleteMany({
      lectureId,
      _id: { $nin: validIds }
    });
  };
  