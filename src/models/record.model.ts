import mongoose, { Schema, Document } from "mongoose";

export const recordSchema: Schema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  duration: { type: String, required: true },
  sessionId: { type: String, required: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
});

export interface IRecord extends Document {
  startTime: Date;
  duration: string;
  sessionId: string;
  url: string;
  title: string;
}
