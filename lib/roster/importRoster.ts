import { ECrewDuty, ECrewFlight } from "@/types/eCrew";
import { supabase } from "@/utils/supabase";
import { findEarliestStartAndLatestEnd } from "@/utils/times";

export async function importRoster(
	eCrewDutiesDetails: ECrewDuty[],
	eCrewFlightsDetails: ECrewFlight[],
) {
	try {
		console.log("Importing roster...");
		console.log("eCrew Duties details:", eCrewDutiesDetails);
		console.log("eCrew Flights details:", eCrewFlightsDetails);

		// Temporarily set a default user ID
		const userID = "1624efbd-569f-4b49-abbb-fb7e62bac69d";

		const { formattedStartDate, formattedEndDate } =
			findEarliestStartAndLatestEnd(eCrewDutiesDetails);

		// Create a roster - this will be a single record that will be inserted into the database
		// roster1 is an object that holds the raw data items for a roster from AIMS but has no unique IDs
		const roster1 = {
			start_date: formattedStartDate,
			end_date: formattedEndDate,
			user_id: userID,
			duty_ids: [],
			duty_period_ids: [],
			old_duty_ids: [],
			old_duty_period_ids: [],
			raw_duty_ids: [],
			raw_duty_period_ids: [],
		};

		// Insert roster into SQL
		// roster2 is the roster1 object with a unique ID and a created_at timestamp
		const { data: roster2, error: rosterError } = await supabase
			.from("roster")
			.insert(roster1)
			.select();

		if (rosterError) {
			console.error("Error inserting roster:", rosterError);
			throw rosterError;
		}

		console.log("Roster inserted:", roster2);

		// Loop through eCrewDutiesDetails to create rawDutyData
		const rawDutyData = [];
		const rawDutyPeriodData = [];

		// Loop through eCrewDutiesDetails ready to insert into raw_duty
		for (const eCrewDutyDetails of eCrewDutiesDetails) {
			// For duties that are all day, create a raw duty record
			if (eCrewDutyDetails.all_day === 1) {
				rawDutyData.push({
					roster_id: roster2[0].roster_id,
					user_id: userID,
					ecrew_duty_id: eCrewDutyDetails.id,
					date: eCrewDutyDetails.start_date,
					duty_type: eCrewDutyDetails.type,
					// TODO: These need some text manipulation to to be extracted out
					duty_code: eCrewDutyDetails.text,
					duty_description: eCrewDutyDetails.text,
					// TODO: Check these times are correct for all duty_types
					report_time:
						eCrewDutyDetails.type === "Flight" ? eCrewDutyDetails.start : null,
					start_time: eCrewDutyDetails.start,
					end_time: eCrewDutyDetails.end,
					debrief_time:
						eCrewDutyDetails.type === "Flight" ? eCrewDutyDetails.end : null,
					// TODO: Check this data is valid
					is_all_day: eCrewDutyDetails.all_day === 1 ? true : false,
					is_positioning: false,
				});
			}
			// For duties that are not all day, create a raw duty period and raw duty record(s)
			else {
				// Create the raw duty record(s)
				if (eCrewDutyDetails.type === "Flight") {
					// Loop through the flights for the duty
					// Find associated eCrewFlightDetails records for this duty
					const associatedFlights = eCrewFlightsDetails.filter(
						(obj) => obj.originalDutyId === eCrewDutyDetails.id,
					);

					// Loop through the flights and create raw duty records
					for (const flight of associatedFlights[0].dutyDetails) {
						rawDutyData.push({
							roster_id: roster2[0].roster_id,
							user_id: userID,
							ecrew_duty_id: eCrewDutyDetails.id,
							date: eCrewDutyDetails.start_date,
							duty_type: eCrewDutyDetails.type,
							// TODO: These need some text manipulation to to be extracted out
							duty_code: eCrewDutyDetails.text,
							duty_description: eCrewDutyDetails.text,
							// TODO: Combine with date into timestamp format, account for +1
							// report_time: flight.StartTime,
							// start_time: flight.LegStartTime,
							// end_time: flight.LegEndTime,
							// debrief_time: flight.EndTime,
							// TODO: Remove these once we have the timestamp format
							report_time: eCrewDutyDetails.start,
							start_time: eCrewDutyDetails.start,
							end_time: eCrewDutyDetails.end,
							debrief_time: eCrewDutyDetails.end,
							is_all_day: false,
							delay_hhmm: flight.Delay,
							// TODO: Look into this and memos
							// indicators: '',
							flight_number: flight.FlightNumber,
							origin: flight.DepStation,
							destination: flight.ArrStation,
							aircraft: flight.AcType,
							registration: flight.Registration,
							gate: flight.Gate,
							stand: flight.Stand,
							expected_pax: flight.ExpPax,
							distance_nm: parseFloat(flight.Distance.replace(" Nm", "")),
							is_positioning: flight.IsDeadhead,
						});
					}
				} else {
					rawDutyData.push({
						roster_id: roster2[0].roster_id,
						user_id: userID,
						ecrew_duty_id: eCrewDutyDetails.id,
						date: eCrewDutyDetails.start_date,
						duty_type: eCrewDutyDetails.type,
						// TODO: These need some text manipulation to to be extracted out
						duty_code: eCrewDutyDetails.text,
						duty_description: eCrewDutyDetails.text,
						// TODO: Check these times are correct for all duty_types
						report_time: null,
						start_time: eCrewDutyDetails.start,
						end_time: eCrewDutyDetails.end,
						debrief_time: null,
						// TODO: Check this data is valid
						is_all_day: false,
						is_positioning: false,
					});
				}

				// Create a raw duty period record
				rawDutyPeriodData.push({
					roster_id: roster2[0].roster_id,
					user_id: userID,
					ecrew_duty_id: eCrewDutyDetails.id,
					date: eCrewDutyDetails.start_date,
					report_time:
						eCrewDutyDetails.type === "Flight" ? eCrewDutyDetails.start : null,
					start_time: eCrewDutyDetails.start,
					end_time: eCrewDutyDetails.end,
					debrief_time:
						eCrewDutyDetails.type === "Flight" ? eCrewDutyDetails.end : null,
					raw_duty_ids: [],
					includes_flights: eCrewDutyDetails.type === "Flight" ? true : false,
					// TODO: This needs to filter the flights for the duty to see if one is a standby
					includes_standby: eCrewDutyDetails.type === "Standby" ? true : false,
				});
			}
		}

		console.log("Raw duty data:", rawDutyData);

		// Insert raw_duty records into database
		const { data: raw_duty, error: rawDutyError } = await supabase
			.from("raw_duty")
			.insert(rawDutyData)
			.select();

		if (rawDutyError) {
			console.error("Error inserting raw_duty:", rawDutyError);
			throw rawDutyError;
		}

		console.log("Inserted raw_duty records:", raw_duty);

		// Get the raw_duty_ids
		const rawDutyIDs = raw_duty.map((obj) => obj.raw_duty_id);

		const rawDutyPeriodDataWithRawDutyIDs = [];

		// Loop through rawDutyPeriodData and add the relevant raw_duty_ids matched by ecrew_duty_id to a new array
		for (const rawDutyPeriod of rawDutyPeriodData) {
			const rawDutyIdsForPeriod = raw_duty
				.filter((duty) => duty.ecrew_duty_id === rawDutyPeriod.ecrew_duty_id)
				.map((duty) => duty.raw_duty_id);
			rawDutyPeriodDataWithRawDutyIDs.push({
				...rawDutyPeriod,
				raw_duty_ids: rawDutyIdsForPeriod,
			});
		}

		// Insert raw_duty_period records into database
		const { data: raw_duty_period, error: rawDutyPeriodError } = await supabase
			.from("raw_duty_period")
			.insert(rawDutyPeriodDataWithRawDutyIDs)
			.select();

		if (rawDutyPeriodError) {
			console.error("Error inserting raw_duty_period:", rawDutyPeriodError);
			throw rawDutyPeriodError;
		}

		// Get the raw_duty_period_ids
		const rawDutyPeriodIDs = raw_duty_period.map(
			(obj) => obj.raw_duty_period_id,
		);

		console.log("Inserted raw_duty_period records:", raw_duty_period);

		// Update the roster record with raw_duty_ids and raw_duty_period_ids (calculated earlier)
		// NOTE: We might not need to do this depending on how we query the data later
		const { data: roster3, error: roster3Error } = await supabase
			.from("roster")
			.update({
				raw_duty_ids: rawDutyIDs,
				raw_duty_period_ids: rawDutyPeriodIDs,
			})
			.eq("roster_id", roster2[0].roster_id)
			.select();

		if (roster3Error) {
			console.error(
				"Error updating raw_duty_ids and raw_flight_ids:",
				roster3Error,
			);
			throw roster3Error;
		}

		console.log(
			"Roster updated with raw_duty_ids and raw_duty_period_ids:",
			roster3,
		);

		// Now find current duties
		// At this point, data has been loaded into the database, we now start the matching process

		const { data: currentDuties, error: currentDutiesError } = await supabase
			.from("duty")
			.select("*")
			.eq("user_id", userID)
			.gte("date", formattedStartDate)
			.lte("date", formattedEndDate);;

		if (currentDutiesError) {
			console.error("Error getting current duties:", currentDutiesError);
			throw currentDutiesError;
		}

		const { data: currentDutyPeriods, error: currentDutyPeriodsError } = await supabase
			.from("duty_period")
			.select("*")
			.eq("user_id", userID)
			.gte("date", formattedStartDate)
			.lte("date", formattedEndDate);

		if (currentDutyPeriodsError) {
			console.error("Error getting current duty periods:", currentDutyPeriodsError);
			throw currentDutyPeriodsError;
		}

		
	} catch (error) {
		console.error("Error importing roster:", error);
		throw error;
	}
}
