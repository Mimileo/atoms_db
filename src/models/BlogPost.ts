import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IBlogPost extends Document {
  _id: ObjectId;
  title: string;
  content: string;
  authorId: ObjectId;
  courseId?: ObjectId;
  stepId?: ObjectId;
  lectureId?: ObjectId;
  problemId?: ObjectId;
  likes: ObjectId[];
  savedBy: ObjectId[];
  shares: number;
  completedBy: ObjectId[];
 
}

const BlogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  stepId: { type: Schema.Types.ObjectId, ref: 'Step' },
  lectureId: { type: Schema.Types.ObjectId, ref: 'Lecture' },
  problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  savedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  shares: { type: Number, default: 0 },
  completedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
export default BlogPost;