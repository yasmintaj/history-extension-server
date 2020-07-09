"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
exports.initDbConnection = () => mongoose_1.default.connect("mongodb://localhost:27017/sessionRecord", (err) => {
    if (!err) {
        console.log("MongoDB connection succeeded.");
    }
    else {
        console.log("Error in MongoDB connection : " + JSON.stringify(err, undefined, 2));
    }
});
