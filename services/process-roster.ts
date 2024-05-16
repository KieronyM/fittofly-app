// services
// import { upcomingDuties } from "@/data/duties";
import { calculateCumulativeHours } from "@/services/process-roster/calculateCumulativeHoursForGivenDay";
import { calculateCurrentFlightAndDutyTotals } from "@/services/process-roster/calculateCurrentFlightAndDutyTotals";
import { calculateDailyMinutes } from "@/services/process-roster/calculateDailyMinutes";
import { calculatedutyBlock } from "@/services/process-roster/calculateDutyBlock";
import { calculateDutyPeriods } from "@/services/process-roster/calculateDutyPeriods";
import { findMaxFDP } from "@/services/process-roster/findMaxFDP";
import { setDutyType } from "@/services/process-roster/setDutyType";
import { validateCumulativeTimeLimts } from "@/services/process-roster/validateCumulativeTimeLimits";
import { validateRestPeriod } from "@/services/process-roster/validateRestPeriod";
import { IRawDuty } from "@/types/duties";

// data
// This will eventually be a DB query given a start and end date and will return all duties within it

export async function processRoster(upcomingDuties: IRawDuty[]) {
	//++++++++++++++
	// Duty Periods:
	//++++++++++++++
	// Calculates the duty periods from an array of duties
	// Will calculate number of sectors, start date/time, duty period &
	// flight duty period (in hours), and identify if eligible for hotel

	const dutyPeriods = calculateDutyPeriods(upcomingDuties);

	//++++++++++++++++
	// Set Combined Duty Type :
	//++++++++++++++++
	// Identifies duty type for the period and disruptive duties
	// Enables OMA 7.1.2.7 & 7.1.2.8
	// Enables OMA 7.4.2.4/5/6/7/8/9/10/11 & 12
	const disruptiveDuties = setDutyType(dutyPeriods);

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

	//+++++++++++++++++++++++++++++
	// Daily Flight & Duty Minutes:
	//+++++++++++++++++++++++++++++
	// Calculates the duty minutes and flight duty minutes for each
	// day where a duty took place
	const { dailyMinutes, aggregatedDailyMinutes } =
		await calculateDailyMinutes(dutyPeriods);

	//++++++++++++++++++++++++++++++++++
	// Maximum Basic Flight Duty Period:
	//++++++++++++++++++++++++++++++++++
	// Enables OMA 7.1.5.4.1
	// Identifies duty periods that exceeded the basic Max FDP without the use of extensions
	// for an acclimitised crew member
	const maxFDPExceeded = await findMaxFDP(dutyPeriods);

	//++++++++++++++++++++++
	// Validate Rest Period:
	//++++++++++++++++++++++
	// OMA 7.1.11.1
	// Identifies inadequate rest periods between FDPs, 12 hour or duration of previous duty if longer
	// Will return an array of rest period objects were of inadequate duration
	const restPeriodShort = await validateRestPeriod(dutyPeriods);

	//++++++++++++++++++++++++++++++++++++++++++++
	// Validate Flight Time and Duty Period Totals:
	//++++++++++++++++++++++++++++++++++++++++++++
	//OMA 7.1.6
	// validates that culmaltive totals of time for 7,14 & 28 days, 28 weeks, 6 & 9 months
	// yearly & 12 monthly are not exceeded. Exceptions are written to totalTimeExceeded
	const totalTimeExceeded = validateCumulativeTimeLimts(
		dailyMinutes,
		aggregatedDailyMinutes,
	);

	//++++++++++++
	// Total Times:
	//++++++++++++
	const currentFlightAndDutyTotals =
		await calculateCurrentFlightAndDutyTotals(dailyMinutes);

	//+++++++++++++++++
	// Cumulative Hours:
	//+++++++++++++++++
	// Accepts the day sent and calculates the flight and duty hours for defined cumulative time limit periods
	// (see cumulative-limits.md) ending on the day

	const cumulativeFlightAndDutyHours = await calculateCumulativeHours(
		dailyMinutes,
		new Date(),
	);
}
