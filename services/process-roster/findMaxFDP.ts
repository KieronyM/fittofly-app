//+++++++++++++
// find Max FDP
//+++++++++++++
// Identifies duty periods that exceeded the basic Max FDP without the use of extensions
// for an acclimitised crew member
//
// Enables OMA 7.1.5.4.1

// types
import { dutyPeriod, maxFDPExceeded} from "@/types";
import { lookupMaxFDP } from "./lookupMaxFDP";
import { convertTimeToMinutes } from "@/utils/times";

export async function findMaxFDP(upcomingDutyPeriods: dutyPeriod[]) {

  // Create an empty array for duty periods where max FDP is exceeded  
  const maxFDPExceeded = [];
  const crewType: string = "uk_pilot_oma";

  //initailise variables for loop
  let DPReportTimeHHMM;
  let maxFDP;
  let maxFDPMins;
  let flightDutyPeriodMins;


  // loop through duty periods
  for (const dutyPeriod of upcomingDutyPeriods) {
    //lookup the maxFDP
    DPReportTimeHHMM = dutyPeriod.reportTime.substring(11, 16); //gets hours & mins in a string
    //console.log(DPReportTimeHHMM);
    maxFDP = (await lookupMaxFDP(crewType, DPReportTimeHHMM, dutyPeriod.sectors)).slice(0, -3);
    maxFDPMins = convertTimeToMinutes(maxFDP);

    flightDutyPeriodMins = convertTimeToMinutes(dutyPeriod.flightDutyPeriodHHMM);
    dutyPeriod.maxFDPHHMM = maxFDP;
    dutyPeriod.isMaxFDPExceeded = false;
    if (flightDutyPeriodMins > maxFDPMins) {
      //writes to array maxFDPExceeded
      maxFDPExceeded.push({
        dutyPeriodID: dutyPeriod.dutyPeriodID, sectors: dutyPeriod.sectors, reportTimeHHMM: DPReportTimeHHMM,
         flightDutyPeriodHHMM: dutyPeriod.flightDutyPeriodHHMM, maxFDPHHMM: maxFDP
      });
      dutyPeriod.isMaxFDPExceeded = true;
    };
  }

  return maxFDPExceeded;
}

