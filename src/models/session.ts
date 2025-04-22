import mongoose from "mongoose";

export interface ISession extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    userAgent?: string;
    createdAt: Date;
    expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<ISession>({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: "User",
        index: true
     },
    userAgent: { type: String },
    createdAt: { type: Date, required: true },
    expiresAt: { 
        type: Date, 
        required: true,
        default: Date.now() + 1000 * 60 * 60 * 24 // 1 day,
     },
});

const Session = mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);

export default Session;