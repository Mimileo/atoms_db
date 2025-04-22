import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IUserProblemProgress extends Document {
   _id: ObjectId; 
  userId: ObjectId;
  courseId: ObjectId;
  stepId: ObjectId;
  lectureId: ObjectId;
  problemId: ObjectId;
  status: 'not_started' | 'in_progress' | 'complete';
  pointsEarned?: number;
  completedAt?: Date;
}

const UserProblemProgressSchema = new Schema<IUserProblemProgress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  stepId: { type: Schema.Types.ObjectId, ref: 'Step' },
  lectureId: { type: Schema.Types.ObjectId, ref: 'Lecture' },
  problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
  status: { type: String, enum: ['not_started', 'in_progress', 'complete'], default: 'not_started' },
  pointsEarned: Number,
  completedAt: Date
}, { timestamps: true });

export default mongoose.models.UserProblemProgress || mongoose.model<IUserProblemProgress>('UserProblemProgress', UserProblemProgressSchema);