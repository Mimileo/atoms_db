import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { compareValue, hashValue } from '../utils/bcrypt';
import UserRole from './enums/userRole';
export interface  IUser extends Document {
    _id: ObjectId | string;
    firstName: string;
    lastName: string;
    username: string;
    schoolName: string;
    enrollments?: mongoose.Types.ObjectId[];
    email: string;
    verified: boolean;
    password: string;
    roles: UserRole[]; 
    dob: Date
    createdAt: Date;
    updatedAt: Date
    comparePassword(val: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    schoolName: { type: String, required: false },
    enrollments: [{ type: Schema.Types.ObjectId, ref: 'Enrollment' }],
    roles: { type: [String], enum: Object.values(UserRole), default: [UserRole.Student], required: true },
    dob: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },{ timestamps: true}
);

userSchema.pre("save", async function (next) {
    // if not modified then no need to hash, just save
    if(!this.isModified("password")) {
        return next();
    }

    this.password = await hashValue(this.password);
    next();
});

userSchema.methods.comparePassword = async function (value: string) {
    return await compareValue(value, this.password);
}

  
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;