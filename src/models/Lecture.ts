import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface ILecture extends Document {
  _id: ObjectId;
  stepId: ObjectId;
  title: string;
  order: number;
  description?: string;
}

const LectureSchema = new Schema<ILecture>({
  stepId: {
     type: Schema.Types.ObjectId, 
     ref: 'Step' 
},
  title: { 
    type: String, 
    required: true 
},
  order: { 
    type: Number, 
    required: true
},
  description: {
    type: String,
    required: false,
  },

}, { timestamps: true });

export default mongoose.models.Lecture || mongoose.model<ILecture>('Lecture', LectureSchema);