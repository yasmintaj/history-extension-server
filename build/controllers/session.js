"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const session_model_1 = tslib_1.__importDefault(require("../models/session.model"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const router = express_1.Router();
router.post("/", addSession);
router.get("/:sessionId", getSession);
function getSession(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log("reqparam", req.params);
        let response;
        const { sessionId } = req.params;
        console.log(sessionId);
        const result = yield session_model_1.default.findOne({ sessionId });
        if (result) {
            response = yield groups(result.records);
        }
        console.log("getres", response);
        res.send(response);
    });
}
function groups(records) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return groupByDomain();
        function groupByDomain() {
            const updatedRecords = [];
            records.forEach((record) => {
                const domain = new URL(record.url).hostname;
                const group = getSameDomain(domain);
                const newRecord = {
                    domain,
                    group,
                };
                updatedRecords.push(newRecord);
            });
            return updatedRecords;
        }
        function getSameDomain(domain) {
            const group = [];
            for (const record of records) {
                if (!hasSameDomain(record, domain)) {
                    continue;
                }
                group.push(record);
                removeItemFromRecords(record);
            }
            return group;
        }
        function removeItemFromRecords(record) {
            const index = records.indexOf(record);
            if (index > -1) {
                records.splice(index, 1);
            }
        }
    });
}
const hasSameDomain = (record, domain) => {
    const recordDomainName = new URL(record.url).hostname;
    return recordDomainName === domain;
};
function addSession(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const sessionData = req.body;
        const { records, emailId, userName } = sessionData;
        const { startTime, endTime, duration } = getSessionDuration(records);
        const updatedRecords = setSessionRecordsDuration(records);
        const session = {
            sessionId: records[0].sessionId,
            emailId,
            userName,
            startTime,
            endTime,
            duration,
            records: updatedRecords,
        };
        const sessionDoc = new session_model_1.default(session);
        yield sessionDoc.save();
        res.sendStatus(201);
    });
}
function setSessionRecordsDuration(records) {
    return records.map((record, index) => {
        if (index === records.length - 1) {
            return Object.assign({ duration: '0' }, record);
        }
        const duration = getRecordDuration(record, records[index + 1]);
        return Object.assign({ duration }, record);
    });
}
function getRecordDuration(record, nextRecord) {
    const startTime = moment_1.default.unix(Number(record.startTime));
    const endTime = moment_1.default.unix(Number(nextRecord.startTime));
    const diff = endTime.diff(startTime, "seconds");
    return millisecondsToHms(diff);
}
function millisecondsToHms(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);
    const humanized = [
        pad(hours.toString(), 2),
        pad(minutes.toString(), 2),
        pad(seconds.toString(), 2),
    ].join(':');
    console.log(humanized);
    return humanized;
}
function pad(n, width, z = '0') {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
;
function getSessionDuration(sessionRecords) {
    const startTime = moment_1.default.unix(getStartTime(sessionRecords));
    const endTime = moment_1.default.unix(getEndTime(sessionRecords));
    const duration = millisecondsToHms(endTime.diff(startTime, "seconds"));
    return { startTime: startTime.toDate(), endTime: endTime.toDate(), duration };
}
function getStartTime(sessionRecords) {
    return Number(sessionRecords[0].startTime);
}
function getEndTime(sessionRecords) {
    return Number(sessionRecords[sessionRecords.length - 1].startTime);
}
exports.default = router;
