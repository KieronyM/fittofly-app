import { eCrewDuty } from "@/lib/roster/importRoster";

export function convertTimeToMinutes(timeString: string): number {
	const [hoursStr, minutesStr] = timeString.split(":");
	const hours = parseInt(hoursStr, 10);
	const minutes = parseInt(minutesStr, 10);

	if (
		isNaN(hours) ||
		isNaN(minutes) ||
		hours < 0 ||
		minutes < 0 ||
		minutes > 59
	) {
		throw new Error("Invalid time format. Please use hh:mm format.");
	}

	return hours * 60 + minutes;
}

export function findEarliestStartAndLatestEnd(eCrewDutiesDetails: eCrewDuty[]) {
	// Find the earliest start date and latest end date
	let earliestStartDate = new Date(eCrewDutiesDetails[0].start);
	let latestEndDate = new Date(eCrewDutiesDetails[0].end);

	for (const duty of eCrewDutiesDetails) {
		const startDate = new Date(duty.start);
		const endDate = new Date(duty.end);

		if (startDate < earliestStartDate) {
			earliestStartDate = startDate;
		}

		if (endDate > latestEndDate) {
			latestEndDate = endDate;
		}
	}

	// Format dates as 'YYYY-MM-DD'
	const formattedStartDate = earliestStartDate.toISOString().split("T")[0];
	const formattedEndDate = latestEndDate.toISOString().split("T")[0];

	return { formattedStartDate, formattedEndDate };
}
