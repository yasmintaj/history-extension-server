import mongoose, { Schema, Document } from "mongoose";
import { recordSchema, IRecord } from "./record.model";
const sessionSchema: Schema = new mongoose.Schema({
  emailId: { type: String, required: true },
  userName:{ type: String, required: true },
  sessionId: { type: String, required: true },
  duration: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  records: [recordSchema],
});

export interface ISession extends Document {
  emailId: string;
  userName: string;
  sessionId: string;
  records: [IRecord];
  duration: string;
  startTime: Date;
  endTime: Date;
}

export default mongoose.model<ISession>("Session", sessionSchema);
