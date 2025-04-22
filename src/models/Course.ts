import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  instructorId: mongoose.Types.ObjectId;
  totalPoints: number;
  accessCode?: string; // Access code for the course will be unique
  status: 'active' | 'draft' | 'archived';
  tags?: string[];
}

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: String,
  instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  totalPoints: { type: Number, default: 0 },
  accessCode: String,
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'draft' },
  tags: { type: [String], default: [] },
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
export default Course;
