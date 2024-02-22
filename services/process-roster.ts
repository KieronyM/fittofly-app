// services
import { calculatedutyBlock } from "@/services/process-roster/calculateDutyBlock";
import { calculateDutyPeriod } from "@/services/process-roster/calculateDutyPeriod";
import { findMaxFDP } from "@/services/process-roster/findMaxFDP";
import { validateRestPeriod } from "@/services/process-roster/validateRestPeriod";
import { calculateDailyMinutes } from "@/services/process-roster/calculateDailyMinutes";
import { validateCumulativeTimeLimts } from "@/services/process-roster/validateCumulativeTimeLimits";
import { calculateCurrentFlightAndDutyTotals } from "@/services/process-roster/calculateCurrentFlightAndDutyTotals";
import { setDutyType } from "@/services/process-roster/setDutyType";

// data
// This will eventually be a DB query given a start and end date and will return all duties within it
import { upcomingDuties } from "@/data/duties";

export async function processRoster() {
    //++++++++++++++
    // Duty Periods:
    //++++++++++++++
    // Calculates the duty periods from an array of duties
    // Will calculate number of sectors, start date/time, duty period & 
    // flight duty period (in hours), and identify if eligible for hotel
    let dutyPeriods = calculateDutyPeriod(upcomingDuties);
    // console.log("dutyPeriods");
    //console.log(dutyPeriods);
    //console.log(upcomingDuties);

    //++++++++++++++++
    // Set Combined Duty Type :
    //++++++++++++++++
    // Identifies duty type for the period and disruptive duties
    // Enables OMA 7.1.2.7 & 7.1.2.8
    // Enables OMA 7.4.2.4/5/6/7/8/9/10/11 & 12
    const disruptiveDuties = setDutyType(dutyPeriods);
    //console.log("dutyPeriods");
    //console.log(dutyPeriods);
    // console.log("disruptiveDuties");
    //console.log(disruptiveDuties);

    //++++++++++++++
    // Duty Blocks:
    //++++++++++++++
    // OMA 7.4.2.3
    // A peiod containing a duty(ies) which is preceeded by minimum 1 day free from duty and followed
    // by min 1 day free of duty
    // Calculates the duty blocks from an array of duty periods
    // Will calculate number of duty periods, start date/time, duty block (in hours) and flight duty block (in hours)
    // writes duty block id to duty period
    const dutyBlocks = await calculatedutyBlock(dutyPeriods);
    // console.log("Duty Period Blocks");
    // console.log(dutyBlocks);

    //+++++++++++++++++++++++++++++
    // Daily Flight & Duty Minutes:
    //+++++++++++++++++++++++++++++
    // Calculates the duty minutes and flight duty minutes for each
    // day where a duty took place
    const { dailyMinutes, aggregatedDailyMinutes } = await calculateDailyMinutes(dutyPeriods);
    // console.log("DAILY MINUTES");
    //console.log("DAILY MINUTES:", dailyMinutes);
    // console.log('AGGREGATED DAILY MINUTES:')
    // console.log(aggregatedDailyMinutes);



    //++++++++++++++++++++++++++++++++++
    // Maximum Basic Flight Duty Period:
    //++++++++++++++++++++++++++++++++++
    // Enables OMA 7.1.5.4.1
    // Identifies duty periods that exceeded the basic Max FDP without the use of extensions
    // for an acclimitised crew member
    const maxFDPExceeded = await findMaxFDP(dutyPeriods);
    //console.log(dutyPeriods);
    // console.log("maxFDPExceeded");
    //console.log(maxFDPExceeded);

    //++++++++++++++++++++++
    // Validate Rest Period:
    //++++++++++++++++++++++
    // OMA 7.1.11.1
    // Identifies inadequate rest periods between FDPs, 12 hour or duration of previous duty if longer
    // Will return an array of rest period objects were of inadequate duration 
    const restPeriodShort = await validateRestPeriod(dutyPeriods);
    //  console.log("restPeriodShort");
    //  console.log(restPeriodShort);
    // console.log(dutyPeriods);

    //++++++++++++++++++++++++++++++++++++++++++++
    // Validate Flight Time and Duty Period Totals:
    //++++++++++++++++++++++++++++++++++++++++++++
    //OMA 7.1.6
    // validates that culmaltive totals of time for 7,14 & 28 days, 28 weeks, 6 & 9 months
    // yearly & 12 monthly are not exceeded. Exceptions are written to totalTimeExceeded 
    const totalTimeExceeded = validateCumulativeTimeLimts(dailyMinutes, aggregatedDailyMinutes);
    // console.log("totalTimeExceeded");
    //console.log(totalTimeExceeded);


    //++++++++++++
    //T otal Times:
    //++++++++++++
    //totalTimeDutyAndFlight();
    const currentFlightAndDutyTotals = await calculateCurrentFlightAndDutyTotals(dailyMinutes);
    // console.log("currentFlighAndDutyTotals");
    // console.log(currentFlightAndDutyTotals);
    // console.log(upcomingDuties);
}