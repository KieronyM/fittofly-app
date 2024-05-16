import { formatDistanceStrict, isSameDay, isSameMonth, format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
	ArrowLeftRightIcon,
	ClockIcon,
	LogInIcon,
	LogOutIcon,
	PlaneIcon,
} from "lucide-react-native";

import { getNameFromIATACode } from "./airport-codes";

import {
	duty,
	dutyNotifications,
	dutyPeriod,
	formattedDutyPeriod,
	timeline,
} from "@/types/duties";

export function addDutiesToDutyPeriods(
	dutyPeriods: dutyPeriod[],
	duties: duty[],
) {
	const dutyPeriodsWithDuties: dutyPeriod[] = [];

	dutyPeriods.forEach((dutyPeriod) => {
		const dutiesInPeriod: duty[] = [];
		duties.forEach((duty) => {
			if (dutyPeriod.dutyIDs.includes(duty.dutyID)) {
				dutiesInPeriod.push(duty);
			}
		});
		dutyPeriodsWithDuties.push({ ...dutyPeriod, duties: dutiesInPeriod });
	});

	return dutyPeriodsWithDuties;
}

// export function calculateDutyPeriod(upcomingDuties: duty[]) {
// 	// Create an empty array for duty periods
// 	const dutyPeriod = [];

// 	//initailise variables for loop
// 	let dutyPeriodID = 0;
// 	let DPDutyIDs = [];
// 	let sectorCount = 0;
// 	let DPStartTime: string | undefined = "";
// 	let DPEndTime: string | undefined = "";
// 	let DPReportTime = "";
// 	let DPDebriefTime = "";
// 	let timeDiff;

// 	// loop through duties
// 	for (const duty of upcomingDuties) {
// 		// populated report time indicates first duty of the period
// 		if (duty.reportTime != null) {
// 			dutyPeriodID++;
// 			DPStartTime = duty.startTime;
// 			DPReportTime = duty.reportTime;
// 			// console.log(duty.dutyID, " reporting time is not empty");
// 		}

// 		// duty within the period
// 		// TODO: These ifs cn be cleaned into an if/else block for efficiency
// 		if (duty.debriefingTime == null) {
// 			//console.log(duty.dutyID, " debrief time empty");
// 			sectorCount++;
// 			DPDutyIDs.push(duty.dutyID);
// 		}

// 		// populated debrief time indicates last duty of the period
// 		else {
// 			sectorCount++;
// 			DPDutyIDs.push(duty.dutyID);
// 			DPEndTime = duty.endTime;
// 			DPDebriefTime = duty.debriefingTime;

// 			//duty period = time required to report or commence a duty and ends when the person is free of all duties including post flight duty
// 			//flight duty period = commences when at the report for duty and finishes when the aircraft comes to rest and engines are shut down on the last sector

// 			//Calculate duty period: duty period = debrief time - reporting time
// 			timeDiff = calculateTimeDifference(
// 				new Date(DPReportTime),
// 				new Date(DPDebriefTime),
// 			); // calling the function calculate time difference
// 			//console.log(`The difference is ${timeDiff.hours} hours and ${timeDiff.minutes} minutes.`);
// 			const dutyPeriodHHMM = `${timeDiff.hours}:${timeDiff.minutes}`; //2 different ways to write to append content to a string, also   let string1 = timeDiff.hours + ':' + timeDiff.minutes

// 			//Calculate flight duty period:  flight duty = end time - reporting time
// 			timeDiff = calculateTimeDifference(
// 				new Date(DPReportTime),
// 				new Date(DPEndTime || ""),
// 			);
// 			const flightDutyPeriodHHMM = `${timeDiff.hours}:${timeDiff.minutes}`;

// 			//writes to array dutyPeriod
// 			//[{ dutyPeriodID: 111, sectors: 2, startTime: 2023-09-19T09:00:00, dutyPeriodHHMM: 14:00, flightDutyPeriodHHMM: 13:45, dutyIDs: [1, 2, 3]}]
// 			dutyPeriod.push({
// 				dutyPeriodID,
// 				sectors: sectorCount,
// 				startTime: DPStartTime,
// 				reportTime: DPReportTime,
// 				endTime: DPEndTime,
// 				debriefTime: DPDebriefTime,
// 				dutyPeriodHHMM,
// 				flightDutyPeriodHHMM,
// 				dutyIDs: DPDutyIDs,
// 				//DPReportTimeHHM
// 			});

// 			//reset for next duty period
// 			sectorCount = 0;
// 			DPDutyIDs = [];
// 			DPStartTime = "0000-00-00T00:00:00";
// 			DPEndTime = "0000-00-00T00:00:00";
// 			DPReportTime = "0000-00-00T00:00:00";
// 			DPDebriefTime = "0000-00-00T00:00:00";
// 			//console.log(duty.dutyID, "debrief time is not empty");
// 			//dutyPeriod.push(sectorCount, duty.dutyID); //writes to array dutyPeriod
// 		}
// 	}
// 	//console.log(dutyPeriod, 'dp'); //displays array dutyPeriod
// 	return dutyPeriod;
// }

export function formatDutyPeriods(dutyPeriods: dutyPeriod[]) {
	const formattedDutyPeriods: formattedDutyPeriod[] = [];

	dutyPeriods.forEach((dutyPeriod) => {
		// Create timeline
		const timeline: timeline[] = [];

		// First, add a reported event
		timeline.push({
			id: 1,
			type: "main",
			startTimeHHMM: formatInTimeZone(
				new Date(dutyPeriod.reportTime),
				"Europe/London",
				"H:mm",
			),
			preTitle: formatInTimeZone(
				new Date(dutyPeriod.reportTime),
				"Europe/London",
				"H:mm",
			),
			title: "Report",
			icon: LogInIcon,
			iconBackground: "bg-sky-500",
		});

		dutyPeriod.duties?.forEach((duty) => {
			if (duty.dutyType.includes("Standby")) {
				timeline.push({
					id: 99,
					type: "main",
					startTimeHHMM: formatInTimeZone(
						new Date(duty.startTime || ""),
						"Europe/London",
						"H:mm",
					),
					endTimeHHMM: formatInTimeZone(
						new Date(duty.endTime || ""),
						"Europe/London",
						"H:mm",
					),
					preTitle: `${formatInTimeZone(
						new Date(duty.startTime || ""),
						"Europe/London",
						"H:mm",
					)} - ${formatInTimeZone(
						new Date(duty.endTime || ""),
						"Europe/London",
						"H:mm",
					)}`,
					title: "Standby",
					icon: ClockIcon,
					iconBackground: "bg-purple-600",
				});
			} else if (duty.dutyType.includes("Flight")) {
				// If the previous duty was a flight, add a turn-around
				if (timeline[timeline.length - 1]?.isFlight) {
					timeline.push({
						id: 999,
						type: "between",
						titlePrefix: `Turnaround - ${formatDistanceStrict(
							new Date(duty.startTime || ""),
							new Date(
								// @ts-ignore
								dutyPeriod.duties?.filter(
									// @ts-ignore
									(duty) =>
										+duty?.dutyID === +timeline[timeline.length - 1]?.id,
								)[0]?.endTime,
							),
							{ unit: "minute" },
						)}`,
						title: "",
						icon: ArrowLeftRightIcon,
						iconBackground: "bg-sky-500",
					});
				}

				// Add the flight itself
				timeline.push({
					id: duty.dutyID,
					type: "main",
					isFlight: true,
					startTimeHHMM: formatInTimeZone(
						new Date(duty.startTime || ""),
						"Europe/London",
						"H:mm",
					),
					endTimeHHMM: formatInTimeZone(
						new Date(duty.endTime || ""),
						"Europe/London",
						"H:mm",
					),
					preTitle: `${formatInTimeZone(
						new Date(duty.startTime || ""),
						"Europe/London",
						"H:mm",
					)} - ${formatInTimeZone(
						new Date(duty.endTime || ""),
						"Europe/London",
						"H:mm",
					)}`,
					title: `${getNameFromIATACode(duty.origin || "")} (${
						duty.origin
					}) to ${getNameFromIATACode(duty.destination || "")} (${
						duty.destination
					})`,
					//   subtitle: "U2 1235 | 2 hrs | G-EZTL (A320)",
					icon: PlaneIcon,
					expandable: false,
					iconBackground: "bg-blue-700",
				});
			}
		});

		// Finally, add an off-duty event
		timeline.push({
			id: 99,
			type: "main",
			endTimeHHMM: formatInTimeZone(
				new Date(dutyPeriod.debriefTime),
				"Europe/London",
				"H:mm",
			),
			preTitle: formatInTimeZone(
				new Date(dutyPeriod.debriefTime),
				"Europe/London",
				"H:mm",
			),
			title: "Off Duty",
			icon: LogOutIcon,
			iconBackground: "bg-sky-500",
		});

		// If it is a duty where the report time matches the first duty, remove report time
		if (timeline[0]?.startTimeHHMM === timeline[1]?.startTimeHHMM) {
			timeline.splice(0, 1);
		}

		// If it is a duty where the debrief time matches the last duty end time, remove off-duty
		if (
			timeline[timeline.length - 2]?.endTimeHHMM ===
			timeline[timeline.length - 1]?.endTimeHHMM
		) {
			timeline.splice(timeline.length - 1, 1);
		}

		// Create duty notifications
		const dutyNotifications: dutyNotifications[] = [];

		// dutyNotifications.push({
		//   type: "info",
		//   text: `Early start`,
		//   icon: SunriseIcon,
		//   iconColour: "text-sky-500",
		// });

		// dutyNotifications.push({
		//   type: "info",
		//   text: `Late finishes (x2)`,
		//   icon: SunsetIcon,
		//   iconColour: "text-sky-500",
		// });

		// // This should open a pop-up with the OMA reference and text
		// // Usually this will be just a night duty
		// dutyNotifications.push({
		//   type: "info",
		//   text: `Night start/night duty`,
		//   icon: MoonIcon,
		//   iconColour: "text-sky-500",
		// });

		// This should be clickable and bring up the FDP table with a highlighted box
		// dutyNotifications.push({
		//   type: "error",
		//   text: `Flight duty period is ${dutyPeriod.flightDutyPeriodHHMM} (max hh:mm).`,
		//   icon: ClockIcon,
		//   iconColour: "text-red-600",
		// });

		// dutyNotifications.push({
		//   type: "warning",
		//   text: `Flight duty period is ${dutyPeriod.flightDutyPeriodHHMM} (max hh:mm).`,
		//   icon: ClockIcon,
		//   iconColour: "text-orange-400",
		// });

		// If flight duty is the same as duty period
		if (dutyPeriod.flightDutyPeriodHHMM === dutyPeriod.dutyPeriodHHMM) {
			// Add flight/duty period message
			dutyNotifications.push({
				type: "info",
				text: `Flight duty and duty period is ${dutyPeriod.flightDutyPeriodHHMM}`,
				// text: `Flight duty period is ${dutyPeriod.flightDutyPeriodHHMM} (max hh:mm).`,
				icon: ClockIcon,
				iconColour: "text-green-500",
			});
		}
		// else
		else {
			// Add flight duty period message
			dutyNotifications.push({
				type: "info",
				text: `Flight duty period is ${dutyPeriod.flightDutyPeriodHHMM}`,
				// text: `Flight duty period is ${dutyPeriod.flightDutyPeriodHHMM} (max hh:mm).`,
				icon: ClockIcon,
				iconColour: "text-green-500",
			});

			// Add normal duty period message
			dutyNotifications.push({
				type: "info",
				text: `Duty period is ${dutyPeriod.dutyPeriodHHMM}`,
				icon: ClockIcon,
				iconColour: "text-green-500",
			});
		}

		// Generate date string
		let dateString = "";
		if (
			isSameDay(
				new Date(dutyPeriod.reportTime),
				new Date(dutyPeriod.debriefTime),
			)
		) {
			dateString = format(new Date(dutyPeriod.reportTime), "EEEE do MMMM");
		} else {
			if (
				isSameMonth(
					new Date(dutyPeriod.reportTime),
					new Date(dutyPeriod.debriefTime),
				)
			) {
				dateString = `${format(
					new Date(dutyPeriod.reportTime),
					"EEEE do",
				)} - ${format(new Date(dutyPeriod.debriefTime), "EEEE do MMMM")}`;
			} else {
				dateString = `${format(
					new Date(dutyPeriod.reportTime),
					"EEEE do MMMM",
				)} - ${format(new Date(dutyPeriod.debriefTime), "EEEE do MMMM")}`;
			}
		}

		// Init object, remove un-needed values
		const formattedDutyPeriod: formattedDutyPeriod = {
			...dutyPeriod,
			duties: undefined,
			dutyIDs: undefined,
			timeline,
			dutyNotifications,
			dateString,
		};

		// Remove any undefined values
		Object.keys(formattedDutyPeriod).forEach((key) =>
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			formattedDutyPeriod[key] === undefined
				? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					delete formattedDutyPeriod[key]
				: {},
		);

		formattedDutyPeriods.push(formattedDutyPeriod);
	});

	return formattedDutyPeriods;
}
