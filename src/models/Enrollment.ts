import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IEnrollment extends Document {
  _id: ObjectId;
  userId: ObjectId;
  courseId: ObjectId;
  courseName?: string; // optional if included
  accessCode: string;
  role: 'student' | 'instructor';
  status: 'active' | 'completed' | 'dropped';
  startDate?: Date;
  endDate?: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    courseName: { type: String }, // optional field, denormalized
    role: { type: String, enum: ['student', 'instructor'], required: true },
    accessCode: { type: String, required: true },
    status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

const Enrollment = mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
export default Enrollment;
