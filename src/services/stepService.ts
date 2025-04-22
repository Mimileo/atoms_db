import Step, { IStep } from "../models/Step";
import mongoose, { isValidObjectId } from "mongoose";

export type StepInput = Pick<IStep, "courseId" | "title" | "order" | "totalPoints" | "totalProblems">;


export const createStep = async (data: StepInput, session?: mongoose.ClientSession) => { 
    const step = await Step.create([data], session ? { session } : {});
    return step[0];
};

export const getAllSteps = async () => {
  return await Step.find().lean();
};

export const getStepsByCourseId = async (courseId: string | mongoose.Types.ObjectId) => {
    if (!isValidObjectId(courseId)) {
        throw new Error("Invalid courseId");
    }
    const steps  = await Step.find({ 
        courseId 
    }).sort({ 
        order: 1 
    });
    return steps;
};


export const updateStep = async (id: string, data: Partial<IStep>) => {
  return await Step.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const deleteStep = async (id: string) => {
  return await Step.findByIdAndDelete(id).lean();
};

export const getStepById = async (id: string) => {
  return await Step.findById(id).lean();    
};

export const upsertStep = async (
    data: Partial<IStep> & { courseId: string },
    session?: mongoose.ClientSession
  ) => {
    if (data._id) {
      return await updateStep(data._id.toString(), data);
    } else {
      return await createStep(data as StepInput, session);
    }
  };


  export const deleteStepsNotIn = async (courseId: string, validIds: string[]) => {
    return await Step.deleteMany({
      courseId,
      _id: { $nin: validIds },
    });
  };
  
  