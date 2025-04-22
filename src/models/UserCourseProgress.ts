import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface ICourseProgress extends Document {
  _id: ObjectId; 
  userId: ObjectId;
  courseId: ObjectId;
  totalPointsEarned: number;
  totalPointsAvailable: number;
  percentage: number;
  completed: boolean;
}

const CourseProgressSchema = new Schema<ICourseProgress>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    totalPointsEarned: { type: Number, default: 0 },
    totalPointsAvailable: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.CourseProgress || mongoose.model<ICourseProgress>('CourseProgress', CourseProgressSchema);