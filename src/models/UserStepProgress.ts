import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IUserStepProgress extends Document {
  _id: ObjectId;
  userId: ObjectId;
  courseId: ObjectId;
  stepId: ObjectId;
  problemsCompleted: number;
  totalProblems: number;
  percentage: number;
  completed: boolean;
}

const UserStepProgressSchema = new Schema<IUserStepProgress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  stepId: { type: Schema.Types.ObjectId, ref: 'Step' },
  problemsCompleted: Number,
  totalProblems: Number,
  percentage: Number,
  completed: Boolean
}, { timestamps: true });

export default mongoose.models.UserStepProgress || mongoose.model<IUserStepProgress>('UserStepProgress', UserStepProgressSchema);