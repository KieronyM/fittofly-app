//++++++++++++++++++++++
// calculate Duty Period
//++++++++++++++++++++++
// Determines the duty periods from duties.
// A duty period is determined by a duty with a reportTime 
// through to a duty with a debriefingTime. Duty Periods are
// written out to array dutyPeriod
//
// Checks OMA 7.1.9.4; eligibility for a hotel 
// write dutyPeriodID back to duties

// config
import { HOTEL_ELIGIBILITY_HHMM } from "@/config/ezy_oma";
import { MINIMUM_REST_PERIOD_HHMM } from "@/config/ezy_oma";
//types
import { duty } from "@/types";
import { calculateTimeDifference } from "./calculateTimeDifference";
import { convertTimeToMinutes } from "@/utils/times";

export function calculateDutyPeriod(upcomingDuties: duty[]) {

    // Create an empty array for duty periods    
    const dutyPeriod = [];

    // Convert hotel eligibility into minutes
    const hotelEligibilityMins = convertTimeToMinutes(HOTEL_ELIGIBILITY_HHMM);
    const minumumRestPeriodMinutes = convertTimeToMinutes(MINIMUM_REST_PERIOD_HHMM);

    //initailise variables for loop
    let dutyPeriodID = 0;
    let DPDutyIDs = [];
    let sectorCount = 0;
    let DPStartTime = "";
    let DPEndTime = "";
    let DPReportTime = "";
    let DPDebriefTime = "";
    let earliestNextDPStartTime = new Date();
    let earliestDPStartTime = new Date();
    let timeDiff;
    let dutyPeriodMinutes;
    let DPminimumRestPeriodMinutes;
    let isEligibleForHotel = false;

    //initialze with a dummy date for the first record
    earliestDPStartTime = new Date(2000, 0, 1);

    // loop through duties
    for (let duty of upcomingDuties) {
        // populated report time indicates first duty of the period       
        if (duty.reportTime != null) {
            dutyPeriodID++;
            DPStartTime = duty.startTime;
            DPReportTime = duty.reportTime;
            // console.log(duty.dutyID, " reporting time is not empty");
            duty.dutyPeriodID = dutyPeriodID;
        }

        // duty within the period
        // TODO: These ifs cn be cleaned into an if/else block for efficiency
        if (duty.debriefingTime == null) {
            //console.log(duty.dutyID, " debrief time empty");
            sectorCount++
            duty.dutyPeriodID = dutyPeriodID;
            DPDutyIDs.push(duty.dutyID);
        }

        // populated debrief time indicates last duty of the period
        else {
            sectorCount++
            duty.dutyPeriodID = dutyPeriodID;
            DPDutyIDs.push(duty.dutyID);
            DPEndTime = duty.endTime;
            DPDebriefTime = duty.debriefingTime;

            //duty period = time required to report or commence a duty and ends when the person is free of all duties including post flight duty
            //flight duty period = commences when at the report for duty and finishes when the aircraft comes to rest and engines are shut down on the last sector

            //Calculate duty period: duty period = debrief time - reporting time 
            timeDiff = calculateTimeDifference(new Date(DPReportTime), new Date(DPDebriefTime)); // calling the function calculate time difference
            let dutyPeriodHHMM = `${timeDiff.hours}:${timeDiff.minutes}` //2 different ways to write to append content to a string, also   let string1 = timeDiff.hours + ':' + timeDiff.minutes 

            //Calculate flight duty period:  flight duty = end time - reporting time  
            timeDiff = calculateTimeDifference(new Date(DPReportTime), new Date(DPEndTime));
            let flightDutyPeriodHHMM = `${timeDiff.hours}:${timeDiff.minutes}`

            //calculate the minimum rest period required either duty period or 12 hours which ever is longer
            dutyPeriodMinutes = convertTimeToMinutes(dutyPeriodHHMM);
            DPminimumRestPeriodMinutes = dutyPeriodMinutes < minumumRestPeriodMinutes ? minumumRestPeriodMinutes : dutyPeriodMinutes;

            earliestNextDPStartTime = new Date(DPDebriefTime);
            earliestNextDPStartTime.setMinutes(earliestNextDPStartTime.getMinutes() + DPminimumRestPeriodMinutes);
            //console.log("rest period min: ", dutyPeriodMinutes, " earliest next duty: ", earliestNextDPStartTime);

            //see if duty eligible for hotel, eg. duty of 14 hours or more OMA 7.1.9.4
            isEligibleForHotel = dutyPeriodMinutes >= hotelEligibilityMins;

            //writes to array dutyPeriod
            dutyPeriod.push({
                dutyPeriodID, sectors: sectorCount,
                startTime: DPStartTime, reportTime: DPReportTime, endTime: DPEndTime, debriefTime: DPDebriefTime,
                dutyPeriodHHMM, flightDutyPeriodHHMM, earliestDPStartTime, earliestNextDPStartTime,
                isEligibleForHotel, dutyIDs: DPDutyIDs
                //DPReportTimeHHM
            });

            //reset for next duty period
            sectorCount = 0;
            DPDutyIDs = [];
            DPStartTime = "0000-00-00T00:00:00";
            DPEndTime = "0000-00-00T00:00:00";
            DPReportTime = "0000-00-00T00:00:00";
            DPDebriefTime = "0000-00-00T00:00:00";
            earliestDPStartTime = earliestNextDPStartTime
        }
    }
    return dutyPeriod;
}