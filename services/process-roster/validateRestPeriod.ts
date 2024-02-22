//+++++++++++++++++++++
// validate Rest Period
//+++++++++++++++++++++
// Identifies inadequate rest periods between FDPs which must be:
// OMA 7.1.11.1 min of 12 hour or duration of previous duty if longer
// update restperiodshot indicator in dutyPeriod and returns
// an array of rest period objects of inadequate duration

// types
import { dutyPeriod } from "@/types";

export async function validateRestPeriod(upcomingDutyPeriods: dutyPeriod[]) {
    // Create an empty array for duty periods where rest period is inadequate  
    const restPeriodShort = [];

    // loop through duty periods and check that the duty commences after adequate rest period
    for (const dutyPeriod of upcomingDutyPeriods) {
        //first record will have a dummy earliestStartDate of 01/01/2000
        //console.log("hello", dutyPeriod.dutyPeriodID);
        dutyPeriod.isRestShort = false;
        if (new Date(dutyPeriod.reportTime) < new Date(dutyPeriod.earliestDPStartTime)) {
            dutyPeriod.isRestShort = true;
            //writes to array restPeriodShort
            restPeriodShort.push({
                dutyPeriodID: dutyPeriod.dutyPeriodID, earliestDPStartTime: new Date(dutyPeriod.earliestDPStartTime), actualDPStartTime: new Date(dutyPeriod.reportTime)
            })
        }
    };

    return restPeriodShort;
}