//++++++++++++++++++++++
// Calculate Duty Period
//++++++++++++++++++++++
// Determines the duty periods from duties.
// A duty period is determined by a duty with a reportTime
// through to a duty with a debriefingTime. Duty Periods are
// written out to array dutyPeriod
//
// Checks OMA 7.1.9.4; eligibility for a hotel
// write dutyPeriodID back to duties
// ----------------------

// config
import {
	HOTEL_ELIGIBILITY_HHMM,
	MINIMUM_REST_PERIOD_HHMM,
} from "@/config/ezy_oma";
// services
import { calculateTimeDifference } from "@/services/process-roster/calculateTimeDifference";
// types;
import { ICalculatedDutyPeriod, IRawDuty } from "@/types/interfaces";
// utils
import { convertTimeToMinutes } from "@/utils/times";

export function calculateDutyPeriods(upcomingDuties: IRawDuty[]) {
	// Create a typed empty array for duty periods
	// TODO: Move this type to a core file
	const dutyPeriods: ICalculatedDutyPeriod[] = [];

	// Convert hotel eligibility into minutes
	const hotelEligibilityMins = convertTimeToMinutes(HOTEL_ELIGIBILITY_HHMM);
	const minumumRestPeriodMinutes = convertTimeToMinutes(
		MINIMUM_REST_PERIOD_HHMM,
	);

	// Initailise variables for loop
	let dutyPeriod = {
		dutyPeriodID: 0,
		startTime: "",
		endTime: "",
		reportTime: "",
		debriefTime: "",
		sectorCount: 0,
		dutyIDs: [] as number[],
		dutyPeriodHHMM: "",
		flightDutyPeriodHHMM: "",
		earliestNextDPStartTime: "",
		earliestDPStartTime: "",
		minimumRestPeriodMinutes: 0,
		isEligibleForHotel: false,
	};

	// Loop through duties
	for (const duty of upcomingDuties) {
		// Populated report time indicates first duty of the period
		if (duty.reportTime !== "") {
			dutyPeriod = {
				...dutyPeriod,
				dutyPeriodID: dutyPeriod.dutyPeriodID + 1,
				dutyIDs: [duty.dutyID].concat(dutyPeriod.dutyIDs),
				startTime: duty.startTime,
				reportTime: duty.reportTime,
			};
		}

		// Duty within the period
		if (duty.debriefingTime === "") {
			dutyPeriod = {
				...dutyPeriod,
				sectorCount: dutyPeriod.sectorCount + 1,
				dutyIDs: [duty.dutyID].concat(dutyPeriod.dutyIDs),
			};
		}

		// Populated debrief time indicates last duty of the period
		else {
			dutyPeriod = {
				...dutyPeriod,
				sectorCount: dutyPeriod.sectorCount + 1,
				dutyIDs: [duty.dutyID].concat(dutyPeriod.dutyIDs),
				endTime: duty.endTime,
				debriefTime: duty.debriefingTime,
			};

			// duty period = time required to report or commence a duty and ends when the person is free of all duties including post flight duty
			// flight duty period = commences when at the report for duty and finishes when the aircraft comes to rest and engines are shut down on the last sector

			// Calculate duty period: duty period = debrief time - reporting time
			const timeDiffDutyPeriod = calculateTimeDifference(
				new Date(dutyPeriod.reportTime),
				new Date(dutyPeriod.debriefTime),
			);

			// calling the function calculate time difference
			const dutyPeriodHHMM = `${timeDiffDutyPeriod.hours}:${timeDiffDutyPeriod.minutes}`;

			// Calculate flight duty period:  flight duty = end time - reporting time
			const timeDiffFlightDutyPeriod = calculateTimeDifference(
				new Date(dutyPeriod.reportTime),
				new Date(dutyPeriod.endTime),
			);
			const flightDutyPeriodHHMM = `${timeDiffFlightDutyPeriod.hours}:${timeDiffFlightDutyPeriod.minutes}`;

			// Calculate the minimum rest period required either duty period or 12 hours which ever is longer
			const dutyPeriodMinutes = convertTimeToMinutes(dutyPeriodHHMM);

			const minimumRestPeriodMinutes =
				dutyPeriodMinutes < minumumRestPeriodMinutes
					? minumumRestPeriodMinutes
					: dutyPeriodMinutes;

			const earliestNextDPStartTime = new Date(dutyPeriod.debriefTime);
			earliestNextDPStartTime.setMinutes(
				earliestNextDPStartTime.getMinutes() + minimumRestPeriodMinutes,
			);

			// See if duty eligible for hotel, eg. duty of 14 hours or more OMA 7.1.9.4
			const isEligibleForHotel = dutyPeriodMinutes >= hotelEligibilityMins;

			dutyPeriod = {
				...dutyPeriod,
				isEligibleForHotel,
				dutyPeriodHHMM,
				flightDutyPeriodHHMM,
				earliestNextDPStartTime: earliestNextDPStartTime.toISOString(),
			};

			dutyPeriods.push(dutyPeriod);

			// Reset for next duty period
			dutyPeriod = {
				dutyPeriodID: dutyPeriod.dutyPeriodID,
				sectorCount: 0,
				dutyIDs: [],
				startTime: "",
				reportTime: "",
				endTime: "",
				debriefTime: "",
				isEligibleForHotel: false,
				dutyPeriodHHMM: "",
				flightDutyPeriodHHMM: "",
				earliestDPStartTime: dutyPeriod.earliestNextDPStartTime,
				earliestNextDPStartTime: "",
				minimumRestPeriodMinutes: 0,
			};
		}
	}

	return dutyPeriods;
}
