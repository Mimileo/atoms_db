import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IStep extends Document {
  _id: ObjectId; 
  courseId: ObjectId | string;
  title: string;
  order: number;
  totalPoints: number;
  totalProblems: number; // Add the totalProblems field here
}

const StepSchema = new Schema<IStep>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  order: { type: Number, required: true },
  totalPoints: { type: Number, default: 0 },
  totalProblems: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Step || mongoose.model<IStep>('Step', StepSchema);
