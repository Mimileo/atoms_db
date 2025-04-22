import Lecture from "../models/Lecture";
import Problem from "../models/Problem";
import Step from "../models/Step";
import UserCourseProgress from "../models/UserCourseProgress";
import UserProblemProgress from "../models/UserProblemProgress";
import UserStepProgress from "../models/UserStepProgress";

export const completeProblemForUser = async (userId: string, problemId: string) => {
  // 1. Mark the problem as completed
  const existing = await UserProblemProgress.findOne({ userId, problemId });
  if (existing?.status === 'complete') return; // already done

  const problem = await Problem.findById(problemId);
  const lecture = await Lecture.findById(problem?.lectureId);
  const step = await Step.findById(lecture?.stepId);

  await UserProblemProgress.findOneAndUpdate(
    { userId, problemId },
    {
      userId,
      problemId,
      status: 'complete',
      pointsEarned: problem?.points || 0,
    },
    { upsert: true, new: true }
  );

  // 2. Update UserStepProgress
  const stepProgress = await UserStepProgress.findOneAndUpdate(
    { userId, stepId: step?._id },
    { $inc: { completedProblems: 1 } },
    { new: true }
  );
  const stepProgressUpdated = await UserStepProgress.findById(stepProgress?._id);
  if (stepProgressUpdated) {
    stepProgressUpdated.progressPercentage = Math.round(
      (stepProgressUpdated.completedProblems / stepProgressUpdated.totalProblems) * 100
    );
    await stepProgressUpdated.save();
  }

  // 3. Update UserCourseProgress
  const courseProgress = await UserCourseProgress.findOneAndUpdate(
    { userId, courseId: step?.courseId },
    { $inc: { completedProblems: 1 } },
    { new: true }
  );
  const updatedCourseProgress = await UserCourseProgress.findById(courseProgress?._id);
  if (updatedCourseProgress) {
    updatedCourseProgress.progressPercentage = Math.round(
      (updatedCourseProgress.completedProblems / updatedCourseProgress.totalProblems) * 100
    );
    await updatedCourseProgress.save();
  }
};
