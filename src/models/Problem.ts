import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import ProblemStatus, { ProblemStatusType } from './enums/problemStatus';
import Difficulty, { DifficultyType } from './enums/difficulty';

export interface IProblem extends Document {
  _id: ObjectId;
  courseId: ObjectId;
  stepId: ObjectId;
  lectureId: ObjectId;
  title: string;
  description: string;
  difficulty: DifficultyType;
  points: number;
  youtubeLink?: string;
  blogId?: ObjectId;
  status: ProblemStatusType;
}

const ProblemSchema = new Schema<IProblem>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  stepId: { type: Schema.Types.ObjectId, ref: 'Step' },
  lectureId: { type: Schema.Types.ObjectId, ref: 'Lecture' },
  title: String,
  description: String,
  difficulty: { type: String, enum: Difficulty },
  points: Number,
  youtubeLink: String,
  blogId: { type: Schema.Types.ObjectId, ref: 'BlogPost' },
  status: { type: String, enum: ProblemStatus },
}, { timestamps: true });

export default mongoose.models.Problem || mongoose.model<IProblem>('Problem', ProblemSchema);