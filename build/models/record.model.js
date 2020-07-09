"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
exports.recordSchema = new mongoose_1.default.Schema({
    startTime: { type: Date, required: true },
    duration: { type: String, required: true },
    sessionId: { type: String, required: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
});
