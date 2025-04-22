import { ObjectId } from 'mongoose';
import UserProblemProgress from '../models/UserProblemProgress';
import UserStepProgress from '../models/UserStepProgress';
import CourseProgress from '../models/UserCourseProgress';
async function updateCourseProgress(userId: ObjectId, courseId: ObjectId) {
    const steps = await UserStepProgress.find({ userId, courseId });

    let totalPointsEarned = 0;
    let totalPointsAvailable = 0;
    let completedSteps = 0;

    for (const step of steps) {
        totalPointsEarned += step.problemsCompleted * step.points; // Assuming points per problem
        totalPointsAvailable += step.totalProblems * step.points; // Assuming all problems are of equal points

        if (step.completed) {
            completedSteps += 1;
        }
    }

    const percentage = (totalPointsEarned / totalPointsAvailable) * 100;

    await CourseProgress.findOneAndUpdate(
        { userId, courseId },
        { totalPointsEarned, totalPointsAvailable, percentage, completed: completedSteps === steps.length },
        { new: true, upsert: true }
    );
}



async function markProblemCompleted(userId: ObjectId, courseId: ObjectId, stepId: ObjectId, lectureId: ObjectId, problemId: ObjectId, pointsEarned: number) {
    // Update or create the UserProblemProgress document
    const problemProgress = await UserProblemProgress.findOneAndUpdate(
        { userId, courseId, stepId, lectureId, problemId },
        { status: 'Completed', pointsEarned, completedAt: new Date() },
        { new: true, upsert: true }
    );

    // Update UserStepProgress based on the completed problem
    const stepProgress = await UserStepProgress.findOne({ userId, courseId, stepId });

    if (stepProgress) {
        // Increment the completed problems count
        const problemsCompleted = stepProgress.problemsCompleted + 1;
        const percentage = (problemsCompleted / stepProgress.totalProblems) * 100;

        await stepProgress.updateOne({
            problemsCompleted,
            percentage,
            completed: problemsCompleted === stepProgress.totalProblems
        });
    }
}

export { updateCourseProgress, markProblemCompleted };
