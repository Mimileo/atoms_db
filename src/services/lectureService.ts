import Lecture, { ILecture } from "../models/Lecture";
import mongoose from "mongoose";


// Define input type
export type LectureInput = Pick<ILecture, "stepId" | "title" | "order" | "description">;

// Updated function
export const createLecture = async (data: LectureInput, session?: mongoose.ClientSession) => {
    const lecture = await Lecture.create([data], session ? { session } : {});
    return lecture[0];
};

export const getAllLectures = async () => {
  return await Lecture.find().lean();
};

export const getLecturesByStepId = async (stepId: string | mongoose.Types.ObjectId) => {
  return await Lecture.find({ stepId }).sort({ order: 1 });
};

export const getLecturesByStepIds = async (stepIds: (string | mongoose.Types.ObjectId)[]) => {
    const lectures = await Lecture.find({ 
        stepId: { $in: stepIds } 
    }).sort({ order: 1 });
    return lectures;
};

export const updateLecture = async (id: string, data: Partial<ILecture>) => {
  return await Lecture.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const deleteLecture = async (id: string) => {
  return await Lecture.findByIdAndDelete(id).lean();
};

export const getLectureById = async (id: string) => {
  return await Lecture.findById(id).lean();
};

export const upsertLecture = async (
    data: Partial<ILecture> & { stepId: string },
    session?: mongoose.ClientSession
  ) => {
    if (data._id) {
      return await updateLecture(data._id.toString(), data);
    } else {
      return await createLecture(data as LectureInput, session);
    }
  };


  export const deleteLecturesNotIn = async (stepId: string, validIds: string[]) => {
    return await Lecture.deleteMany({
      stepId,
      _id: { $nin: validIds }
    });
  };
  
  