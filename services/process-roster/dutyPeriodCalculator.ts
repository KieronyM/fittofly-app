
// types
import { duty } from "@/types";
import { calculateTimeDifference } from "./calculateTimeDifference";
import { lookupMaxFDP } from "./lookupMaxFDP";
import { convertTimeToMinutes } from "@/utils/times";

//not sure what this does!!!
export async function dutyPeriodCalculator(upcomingDuties: duty[]) {

    // Create an empty array for duty periods    
    const dutyPeriod = [];

    //initailise variables for loop
    let dutyPeriodID = 0;
    let DPDutyIDs = [];
    let sectorCount = 0;
    let DPStartTime = "";
    let DPEndTime = "";
    let DPReportTime = "";
    let DPReportTimeHHMM;
    let DPDebriefTime = "";
    let timeDiff;
    let maxFDP;
    let maxFDPMins;
    let flightDutyPeriodMins;
    let isExceedsMaxFDP = false;  //check this is the correct place
    let isDisruptiveSchedule = false;
    let isEligibleForHotel = false;




    // loop through duties
    for (const duty of upcomingDuties) {
        // populated report time indicates first duty of the period       
        if (duty.reportTime != null) {
            dutyPeriodID++;
            DPStartTime = duty.startTime;
            DPReportTime = duty.reportTime;
            // console.log(duty.dutyID, " reporting time is not empty");
        }

        // duty within the period
        // TODO: These ifs cn be cleaned into an if/else block for efficiency
        if (duty.debriefingTime == null) {
            //console.log(duty.dutyID, " debrief time empty");
            sectorCount++
            DPDutyIDs.push(duty.dutyID);

            if (duty.isDisruptiveSchedule) {
                isDisruptiveSchedule = true
            };
        }

        // populated debrief time indicates last duty of the period
        else {
            sectorCount++
            DPDutyIDs.push(duty.dutyID);

            if (duty.isDisruptiveSchedule) {
                isDisruptiveSchedule = true
            };

            DPEndTime = duty.endTime;
            DPDebriefTime = duty.debriefingTime;

            //duty period = time required to report or commence a duty and ends when the person is free of all duties including post flight duty
            //flight duty period = commences when at the report for duty and finishes when the aircraft comes to rest and engines are shut down on the last sector

            //Calculate duty period: duty period = debrief time - reporting time 
            timeDiff = calculateTimeDifference(new Date(DPReportTime), new Date(DPDebriefTime)); // calling the function calculate time difference
            //console.log(`The difference is ${timeDiff.hours} hours and ${timeDiff.minutes} minutes.`);
            let dutyPeriodHHMM = `${timeDiff.hours}:${timeDiff.minutes}` //2 different ways to write to append content to a string, also   let string1 = timeDiff.hours + ':' + timeDiff.minutes 

            //Calculate flight duty period:  flight duty = end time - reporting time  
            timeDiff = calculateTimeDifference(new Date(DPReportTime), new Date(DPEndTime));
            let flightDutyPeriodHHMM = `${timeDiff.hours}:${timeDiff.minutes}`
            //-------------------------------------



            //find the maxFDP
            //maxFDP= findMaxFDP(DPReportTime, sectorCount);
            //find reporting time hhmm
            DPReportTimeHHMM = DPReportTime.substring(11, 16); //gets hours 7 & mins in a string
            //console.log(DPReportTimeHHMM);
            maxFDP = (await lookupMaxFDP(DPReportTimeHHMM, sectorCount)).slice(0, -3);
            maxFDPMins = convertTimeToMinutes(maxFDP);

            flightDutyPeriodMins = convertTimeToMinutes(flightDutyPeriodHHMM);
            if (flightDutyPeriodMins > maxFDPMins) { isExceedsMaxFDP = true };

            isExceedsMaxFDP = flightDutyPeriodMins >= maxFDPMins;

            // console.log(isExceedsMaxFDP);


            //writes to array dutyPeriod
            //[{ dutyPeriodID: 111, sectors: 2, startTime: 2023-09-19T09:00:00, dutyPeriodHHMM: 14:00, flightDutyPeriodHHMM: 13:45, dutyIDs: [1, 2, 3]}]
            dutyPeriod.push({
                dutyPeriodID, sectors: sectorCount, reportTime: DPReportTime, DPReportTimeHHMM, startTime: DPStartTime,
                endTime: DPEndTime, debriefTime: DPDebriefTime,
                dutyPeriodHHMM, flightDutyPeriodHHMM, dutyIDs: DPDutyIDs,
                isExceedsMaxFDP, flightDutyPeriodMins, maxFDP, maxFDPMins,
                isDisruptiveSchedule
            });


            //reset for next duty period
            sectorCount = 0;
            DPDutyIDs = [];
            DPStartTime = "0000-00-00T00:00:00";
            DPEndTime = "0000-00-00T00:00:00";
            DPReportTime = "0000-00-00T00:00:00";
            DPDebriefTime = "0000-00-00T00:00:00";
            isExceedsMaxFDP = false
            //console.log(duty.dutyID, "debrief time is not empty");
            //dutyPeriod.push(sectorCount, duty.dutyID); //writes to array dutyPeriod   
        }
    }
    // console.log(dutyPeriod, 'dp'); //displays array dutyPeriod
    return dutyPeriod;
}
