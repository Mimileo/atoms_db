import Lecture from "../../models/Lecture";
import Problem from "../../models/Problem";
import Step from "../../models/Step";
import UserProblemProgress from "../../models/UserProblemProgress";

export const getCourseProblemProgress = async (userId: string, courseId: string) => {
  const steps = await Step.find({ courseId });
  console.log(steps);
  const lectures = await Lecture.find({ courseId });

  const lectureMap = new Map(lectures.map(lec => [lec._id.toString(), lec.stepId.toString()]));

  const problems = await Problem.find({
    lectureId: { $in: lectures.map(l => l._id) }
  });

  const userProgress = await UserProblemProgress.find({
    userId,
    problemId: { $in: problems.map(p => p._id) },
    status: 'complete'
  });

  // Map from stepId to number of completed problems
  const stepProblemMap = new Map<string, { total: number, completed: number }>();

  for (const problem of problems) {
    const stepId = lectureMap.get(problem.lectureId.toString());
    if (!stepId) continue;

    const existing = stepProblemMap.get(stepId) || { total: 0, completed: 0 };
    existing.total += 1;

    const isCompleted = userProgress.some(up => up.problemId.toString() === problem._id.toString());
    if (isCompleted) existing.completed += 1;

    stepProblemMap.set(stepId, existing);
  }

  const stepProgress = Array.from(stepProblemMap.entries()).map(([stepId, { total, completed }]) => ({
    stepId,
    progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    completed,
    total,
  }));

  const totalProblems = problems.length;
  const totalCompleted = userProgress.length;
  const courseProgress = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;

  return {
    courseProgress,
    totalCompleted,
    totalProblems,
    stepProgress,
  };
};
