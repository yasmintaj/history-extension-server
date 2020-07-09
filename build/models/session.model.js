"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const record_model_1 = require("./record.model");
const sessionSchema = new mongoose_1.default.Schema({
    emailId: { type: String, required: true },
    userName: { type: String, required: true },
    sessionId: { type: String, required: true },
    duration: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    records: [record_model_1.recordSchema],
});
exports.default = mongoose_1.default.model("Session", sessionSchema);
