import { Router, Request, Response } from "express";
import Session, { ISession } from "../models/session.model";
import moment from "moment";
import { IRecord } from "src/models/record.model";
const router = Router();

router.post("/", addSession);
router.get("/:sessionId", getSession);

async function getSession(req: Request, res: Response) {
  console.log("reqparam", req.params)
  let response;
  const { sessionId } = req.params;
  console.log(sessionId)
  const result = await Session.findOne({ sessionId });
  if (result) {
    response = await groups(result.records);
  }
  console.log("getres", response)
  res.send(response);
}

async function groups(records: IRecord[]) {
  return groupByDomain();

  function groupByDomain() {
    const updatedRecords: { domain: string; group: IRecord[] }[] = [];
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

  function getSameDomain(domain: string) {
    const group: IRecord[] = [];
    for (const record of records) {
      if (!hasSameDomain(record, domain)) {
        continue;
      }

      group.push(record);
      removeItemFromRecords(record);
    }

    return group;
  }

  function removeItemFromRecords(record: IRecord) {
    const index = records.indexOf(record);
    if (index > -1) {
      records.splice(index, 1);
    }
  }
}

const hasSameDomain = (record: IRecord, domain: string) => {
  const recordDomainName = new URL(record.url).hostname;
  return recordDomainName === domain;
};

async function addSession(req: Request, res: Response) {
  const sessionData: SessionRequest = req.body;
  const {records, emailId, userName} = sessionData
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

  const sessionDoc: ISession = new Session(session);
  await sessionDoc.save();
  res.sendStatus(201);
}

/*
  Calculate duration for all tab records
  in the list of records
*/
function setSessionRecordsDuration(records: Record[]): Record[] {
  return records.map((record, index) => {
    if (index === records.length - 1) {
      return { duration: '0', ...record };
    }

    const duration = getRecordDuration(record, records[index + 1]);
    return { duration, ...record };
  });
}

/*
  Calculate duration for a tab record
*/
function getRecordDuration(record: Record, nextRecord: Record): string {
  const startTime = moment.unix(Number(record.startTime));
  const endTime = moment.unix(Number(nextRecord.startTime));
  const diff =  endTime.diff(startTime, "seconds");
  return millisecondsToHms(diff)

}

function millisecondsToHms(ms: number) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor(ms / 1000 / 60 / 60);

  const humanized = [
      pad(hours.toString(), 2),
      pad(minutes.toString(), 2),
      pad(seconds.toString(), 2),
  ].join(':');
  console.log(humanized)
  return humanized;
}
function pad(n: string, width: number, z = '0') {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

// get overall session duration
function getSessionDuration(
  sessionRecords: [Record]
): { startTime: Date; endTime: Date; duration: string } {
  const startTime = moment.unix(getStartTime(sessionRecords));
  const endTime = moment.unix(getEndTime(sessionRecords));
  const duration = millisecondsToHms(endTime.diff(startTime, "seconds"));
  return { startTime: startTime.toDate(), endTime: endTime.toDate(), duration };
}

function getStartTime(sessionRecords: [Record]): number {
  return Number(sessionRecords[0].startTime);
}

function getEndTime(sessionRecords: [Record]): number {
  return Number(sessionRecords[sessionRecords.length - 1].startTime);
}

export interface SessionRequest {
  records: [Record],
  emailId: string,
  userName: string
}

export interface Record {
  startTime: string;
  duration: string;
  sessionId: string;
  url: string;
  title: string;
}

export default router;
