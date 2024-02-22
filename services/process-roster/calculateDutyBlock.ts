//++++++++++++++++++++++++++++
// calculate Duty Period Block
//++++++++++++++++++++++++++++
// Determines the duty period blocks from duty periods.
// A duty block is determined by a period containing a duty or duties which 
// is preceeded by a min of 1 day free from duty and followed by 
// a min of 1 day free from duty (7.4.2.3)
// uses reportTime and debriefTime
//
// duty blocks written out to array dutyBlock
// blockID written back to dutyPeriod

// types
import { dutyPeriod } from "@/types";
import { calculateTimeDifference } from "./calculateTimeDifference";

export async function calculatedutyBlock(upcomingDutyPeriods: dutyPeriod[]) {

    // Create an empty array for duty period blocks
    // @ts-ignore 
    const dutyBlock = [];

    //initailise variables for loop
    let dutyBlockID = 0;
    let DPBDutyPeriodIDs = [];
    let DPBPeriodCount = 0;
    let DPBReportTime = "";
    let DPBDebriefTime = "";
    let debriefTimePlus24Hours = new Date();
    let DPBTimeHHMM;
    let timeDiff;


    // loop through periods
    for (const dutyPeriod of upcomingDutyPeriods) {

        //First period of dutyperiod
        if (dutyBlockID == 0) { //this will be the first record that is found
            dutyBlockID++;
        } else {
            if (new Date(dutyPeriod.reportTime) >= debriefTimePlus24Hours) {
                //write out previous record and reset for new block
                timeDiff = calculateTimeDifference(new Date(DPBReportTime), new Date(DPBDebriefTime));
                DPBTimeHHMM = `${timeDiff.hours}:${timeDiff.minutes}`
                dutyBlock.push({
                    dutyBlockID, periodCount: DPBPeriodCount,
                    reportTime: DPBReportTime, debriefTime: DPBDebriefTime,
                    duration: DPBTimeHHMM,
                    dutyPeriodIDs: DPBDutyPeriodIDs
                });
                DPBPeriodCount = 0;
                DPBDutyPeriodIDs = [];
                dutyBlockID++;
            }
        }
       
        DPBPeriodCount++
        dutyPeriod.dutyBlockID = dutyBlockID;
        if (DPBPeriodCount == 1) {
            DPBReportTime = dutyPeriod.reportTime;
        }
        DPBDebriefTime = dutyPeriod.debriefTime;
        DPBDutyPeriodIDs.push(dutyPeriod.dutyPeriodID);
        debriefTimePlus24Hours = new Date(new Date(dutyPeriod.debriefTime).getTime() + 24 * 60 * 60 * 1000)
    }

    //last period of dutyperiod, write out final block
     //Calculate duty period: duty period = debrief time - reporting time 
    timeDiff = calculateTimeDifference(new Date(DPBReportTime), new Date(DPBDebriefTime)); // calling the function calculate time difference
    DPBTimeHHMM = `${timeDiff.hours}:${timeDiff.minutes}`

    dutyBlock.push({
        dutyBlockID, periodCount: DPBPeriodCount,
        reportTime: DPBReportTime, debriefTime: DPBDebriefTime,
        duration: DPBTimeHHMM,
        dutyPeriodIDs: DPBDutyPeriodIDs
    });
    return dutyBlock
}
