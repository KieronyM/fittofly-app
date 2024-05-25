import { Event } from "expo-calendar";

import { IRawDuty } from "@/types/interfaces";

export function calendarToDuties(calendarEvents: Event[]) {
	const parsedEvents: IRawDuty[] = [];

	calendarEvents.forEach((calendarEvent, index) => {
		// Do not handle all day events
		if (!calendarEvent.allDay) {
			// Housekeeping to make sure these are in string format
			let parsedStart = calendarEvent.startDate;
			let parsedEnd = calendarEvent.endDate;

			if (parsedStart instanceof Date) {
				parsedStart = parsedStart.toISOString();
			}

			if (parsedEnd instanceof Date) {
				parsedEnd = parsedEnd.toISOString();
			}

			// Check if the event is a flight
			if (calendarEvent.title?.includes("-")) {
				const origin = calendarEvent.title.split("-")[0] as string;
				const destination = calendarEvent.title.split("-")[1] as string;

				// Parse out returns
				const description = calendarEvent.notes?.replaceAll("\r", "") as string;

				// Split out into an array of lines
				const descriptionByLines = description.split("\n");

				// Remove blank lines & eCrew line
				const parsedLines = descriptionByLines.filter(
					(line) => line !== "" && line !== "---Created by the eCrew app---",
				);

				let debriefingTime = "";
				let reportTime = "";
				let startTime = "";
				let endTime = "";

				parsedLines.find((line) => {
					if (line.includes("Reporting time:")) {
						// Removes the bit before reporting time text
						const time = line.substring(16);

						if (time.includes("+1")) {
							// TODO: Handle next day case
						} else {
							// Construct date time
							// @ts-ignore
							const date = parsedStart.slice(0, 10);
							const hours = time.slice(0, 2);
							const mins = time.slice(2, 4);
							reportTime = `${date}T${hours}:${mins}:00Z`;
						}
					} else if (line.includes("Debriefing time:")) {
						// Removes the bit before debriefing time text
						const times = line.substring(17);

						const lastTime = times.split("-")[1] as string;

						if (lastTime) {
							if (lastTime?.includes("+1")) {
								// TODO: Handle next day case
							} else {
								// Construct date time
								// @ts-ignore
								const date = parsedEnd.slice(0, 10);
								const hours = lastTime.slice(0, 2);
								const mins = lastTime.slice(2, 4);
								debriefingTime = `${date}T${hours}:${mins}:00Z`;
							}
						} else {
							// @ts-ignore
							const date = parsedEnd.slice(0, 10);
							const hours = times.slice(0, 2);
							const mins = times.slice(2, 4);
							debriefingTime = `${date}T${hours}:${mins}:00Z`;
						}
					}
					// Do normal start and end times
					else if (line.includes(origin) && line.includes(destination)) {
						const regex = /(?<=\().*?(?=\))/gm;
						const regExTimes = [...line.matchAll(new RegExp(regex))];
						const times: string[] = [];
						regExTimes.forEach((time) => times.push(time[0]));

						// Start Time
						// @ts-ignore
						const startDate = parsedStart.slice(0, 10);
						const startHours = (times[0] || "").replace(/\D/g, "").slice(0, 2);
						const startMins = (times[0] || "").replace(/\D/g, "").slice(2, 4);
						startTime = `${startDate}T${startHours}:${startMins}:00Z`;

						// End Time
						// @ts-ignore
						const endDate = parsedEnd.slice(0, 10);
						const endHours = (times[1] || "").replace(/\D/g, "").slice(0, 2);
						const endMins = (times[1] || "").replace(/\D/g, "").slice(2, 4);
						endTime = `${endDate}T${endHours}:${endMins}:00Z`;
					}
				});

				const duty = {
					dutyID: index,
					dutyType: "Flight",
					origin,
					destination,
					reportTime: reportTime !== "" ? reportTime : startTime,
					debriefingTime,
					startTime,
					endTime,
				};

				// Remove any undefined values
				Object.keys(duty).forEach((key) =>
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					duty[key] === undefined ? delete duty[key] : {},
				);

				parsedEvents.push(duty);
			}

			// Else if the event is a standby
			else if (calendarEvent.title?.includes("SBY")) {
				const origin = calendarEvent.location?.split(")")[1]?.trim();
				const destination = calendarEvent.location?.split(")")[1]?.trim();

				// Parse out returns
				const description = calendarEvent.notes?.replaceAll("\r", "") as string;

				// Split out into an array of lines
				const descriptionByLines = description.split("\n");

				// Remove blank lines & eCrew line
				const parsedLines = descriptionByLines.filter(
					(line) => line !== "" && line !== "---Created by the eCrew app---",
				);

				let debriefingTime = "";
				let reportTime = "";
				let startTime = "";
				let endTime = "";

				parsedLines.find((line) => {
					if (line.includes("Reporting time:")) {
						// Removes the bit before reporting time text
						const time = line.substring(16);

						if (time.includes("+1")) {
							// TODO: Handle next day case
						} else {
							// Construct date time
							// @ts-ignore
							const date = parsedStart.slice(0, 10);
							const hours = time.slice(0, 2);
							const mins = time.slice(2, 4);
							reportTime = `${date}T${hours}:${mins}:00Z`;
						}
					} else if (line.includes("Debriefing time:")) {
						// Removes the bit before debriefing time text
						const times = line.substring(17);

						// Handles the debriefing time being a range rather than a fixed time
						if (times.split("-")[1]) {
							console.log("Debrief is split! Send help!");

							// const lastTime = times.split("-")[1] as string;

							// Construct date time
							// @ts-ignore
							// const date = parsedEnd.slice(0, 10);
							// const hours = parsedEnd.slice(0, 2);
							// const mins = lastTime.slice(2, 4);
							// debriefingTime = `${date}T${hours}:${mins}:00Z`;
						}
						// If it is a single time
						else {
							// @ts-ignore
							const date = parsedEnd.slice(0, 10);
							const hours = times.slice(0, 2);
							const mins = times.slice(2, 4);
							debriefingTime = `${date}T${hours}:${mins}:00Z`;
						}
					}
					// Do normal start and end times
					else if (line.includes("Standby")) {
						const regex = /(?<=\().*?(?=\))/gm;
						const regExTimes = [...line.matchAll(new RegExp(regex))];
						const times: string[] = [];
						regExTimes.forEach((time) => times.push(time[0]));

						// Start Time
						// @ts-ignore
						const startDate = parsedStart.slice(0, 10);
						const startHours = (times[0] || "").replace(/\D/g, "").slice(0, 2);
						const startMins = (times[0] || "").replace(/\D/g, "").slice(2, 4);
						startTime = `${startDate}T${startHours}:${startMins}:00Z`;

						// End Time
						// @ts-ignore
						const endDate = parsedEnd.slice(0, 10);
						const endHours = (times[1] || "").replace(/\D/g, "").slice(0, 2);
						const endMins = (times[1] || "").replace(/\D/g, "").slice(2, 4);
						endTime = `${endDate}T${endHours}:${endMins}:00Z`;
					}
				});
				const duty = {
					dutyID: index,
					dutyType: "Standby",
					origin,
					destination,
					reportTime,
					debriefingTime,
					startTime,
					endTime,
				};

				// Remove any undefined values
				Object.keys(duty).forEach((key) =>
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					duty[key] === undefined ? delete duty[key] : {},
				);

				parsedEvents.push(duty);
			}
		}
	});

	return parsedEvents;
}
