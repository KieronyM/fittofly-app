import { ECrewDuty, ECrewFlight } from "@/types/eCrew";
import { Database } from "@/types/supabase";
import { supabase } from "@/utils/supabase";
import { findEarliestStartAndLatestEnd } from "@/utils/times";
import { getObjectDiff, isEqual } from "../utils";

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

		// 1. Create a roster - this will be a single record that will be inserted into the database
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

		// 2. Insert roster into SQL
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
		const rosterId = roster2[0].roster_id;

		// 3. Loop through eCrewDutiesDetails to create rawDutyData
		const rawDutyData = [];
		const rawDutyPeriodData = [];
		const hotelDutyData = [];
		const hotelDutyDates = [];
		const flightDutyCounts = [];
		const standbyDutyDates = [];
		let iFlightCount = 0;


		// Loop through eCrewDutiesDetails ready to insert into raw_duty
		for (const eCrewDutyDetails of eCrewDutiesDetails) {
			// For duties that are all day, create a raw duty record
			if (eCrewDutyDetails.all_day === 1) {
				rawDutyData.push({
					roster_id: rosterId,
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
// if the duty is a standby write date out ready to update raw duty period later
if (eCrewDutyDetails.type === "Standby"){
standbyDutyDates.push({
	dpDate: eCrewDutyDetails.start_date.slice (0,10) //KM to do date better
});

console.log("Raw duty Standby:", standbyDutyDates);
}



				// Create the raw duty record(s)
				if (eCrewDutyDetails.type === "Flight") {
					// Loop through the flights for the duty
					// Find associated eCrewFlightDetails records for this duty
					const associatedFlights = eCrewFlightsDetails.filter(
						(obj) => obj.originalDutyId === eCrewDutyDetails.id,
					);

					// Loop through the flights and create raw duty records
					iFlightCount = 0;
					for (const flight of associatedFlights[0].dutyDetails) {
						iFlightCount += 1;
						rawDutyData.push({
							roster_id: rosterId,
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
					} // end of creating raw_duty(s) of type flight
				//write summary flight info 
				flightDutyCounts.push({
					dpDate: eCrewDutyDetails.start_date.slice (0,10), flightCount: iFlightCount //KM to do date better
				});
				console.log("Flight Counts:", flightDutyCounts);
				}
				else {
					if (eCrewDutyDetails.type === "Hotel") {
						hotelDutyData.push({
							roster_id: rosterId,
							user_id: userID,
							ecrew_duty_id: eCrewDutyDetails.id,
							date: eCrewDutyDetails.start_date,
							duty_type: eCrewDutyDetails.type,
							// TODO: These need some text manipulation to to be extracted out
							duty_code: eCrewDutyDetails.text,
							duty_description: eCrewDutyDetails.text,
							start_time: eCrewDutyDetails.start,
							end_time: eCrewDutyDetails.end,
						});
						hotelDutyDates.push({
							dpDate: eCrewDutyDetails.start_date.slice (0,10) //KM to do date better
						});

						console.log("Raw duty dataHotel:", hotelDutyData, hotelDutyDates);
					}
					else {
						rawDutyData.push({
							roster_id: rosterId,
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
				}
			} // endof duties that are not all day 
		} // endof loop around eCrewDuties


		// 4. Create raw_duty_period
		for (const eCrewDutyDetails of eCrewDutiesDetails) {
			// For duties that are not all day, create a raw duty period
			if (!eCrewDutyDetails.all_day && eCrewDutyDetails.type !== "Hotel" ) {
			rawDutyPeriodData.push({
							roster_id: rosterId,
							user_id: userID,
							ecrew_duty_id: eCrewDutyDetails.id,
							date: eCrewDutyDetails.start_date,
							report_time: null,
							start_time: eCrewDutyDetails.start,
							end_time: eCrewDutyDetails.end,
							debrief_time: null,
							raw_duty_ids: [],
				 			//KM we can use standbyDutyDates, FlightDutyDates and hotelDutyDates to update, match on date
							// includes_standby: if record present for date
							// includes_flights: if record for date
							// sectors: if record present = flight count
							// includes_hotel = if record present
				 		});
			} // endof duties loop for condition not all day or hotel 
		} // endof loop around eCrewDuties for creating raw_duty_period

	
		//HM!!!!!!!add a error check here to ensure that raw_duty_periods are unique by day e.g. duty types of 'Hotel' had been causing dupes to occur 

		console.log("Raw duty data:", rawDutyData);

		// 5. Insert raw_duty records into database
		const { data: raw_duty, error: rawDutyError } = await supabase
			.from("raw_duty")
			.insert(rawDutyData)
			.select();

		if (rawDutyError) {
			console.error("Error inserting raw_duty:", rawDutyError);
			throw rawDutyError;
		}

		console.log("Inserted raw_duty records:", raw_duty);

		// 6. Get the raw_duty_ids
		const rawDutyIDs = raw_duty.map((obj) => obj.raw_duty_id);

		// 7. Loop through rawDutyPeriodData and add the relevant raw_duty_ids matched by ecrew_duty_id to a new array
		const rawDutyPeriodDataWithRawDutyIDs = [];
		for (const rawDutyPeriod of rawDutyPeriodData) {
			const rawDutyIdsForPeriod = raw_duty
				.filter((duty) => duty.ecrew_duty_id === rawDutyPeriod.ecrew_duty_id)
				.map((duty) => duty.raw_duty_id);
			rawDutyPeriodDataWithRawDutyIDs.push({
				...rawDutyPeriod,
				raw_duty_ids: rawDutyIdsForPeriod,
			});
		}

		//7a. see if the duty Period has a hotel stay for the same day
		//includes_hotel: hotelDutyDates.some(
		//	(date) => date.date === eCrewDutyDetails.start_date,
		//)


		// 7b. Insert hotel_duty records into database
		if (hotelDutyData.length > 0) {
			const { data: hotelDuty, error: hotelDutyDataError } = await supabase
				.from("hotel_duty")
				.insert(hotelDutyData)
				.select();

			if (hotelDutyDataError) {
				console.error("Error inserting hotel_duty:", hotelDutyDataError);
				throw hotelDutyDataError;
			}
		}

		// 8. Insert raw_duty_period records into database
		const { data: rawDutyPeriodWithRawIds, error: rawDutyPeriodError } =
			await supabase
				.from("raw_duty_period")
				.insert(rawDutyPeriodDataWithRawDutyIDs)
				.select();

		if (rawDutyPeriodError) {
			console.error("Error inserting raw_duty_period:", rawDutyPeriodError);
			throw rawDutyPeriodError;
		}

		// 9. Get the raw_duty_period_ids
		const rawDutyPeriodIDs = rawDutyPeriodWithRawIds.map(
			(obj) => obj.raw_duty_period_id,
		);

		console.log("Inserted raw_duty_period records:", rawDutyPeriodWithRawIds);

		// 10. Loop through raw_duty_period and extract the raw_duty_ids.
		// We need an array of objects where the ID is the raw_duty_id and the value is the raw_duty_period_id
		const rawDutiesWithRawDutyPeriodIDs = rawDutyPeriodWithRawIds.flatMap(
			(obj) =>
				obj.raw_duty_ids.map((rawDutyID) => {
					const duty = raw_duty.find((d) => d.raw_duty_id === rawDutyID);
					if (!duty) {
						throw new Error(`Could not find duty with ID ${rawDutyID}`);
					}
					return {
						...duty,
						updated_at: new Date().toISOString(),
						date: obj.date,
						raw_duty_period_id: obj.raw_duty_period_id,
						// Ensure required fields are present and not undefined
						duty_code: duty.duty_code,
						duty_description: duty.duty_description,
						duty_type: duty.duty_type,
						user_id: duty.user_id,
						ecrew_duty_id: duty.ecrew_duty_id,
						raw_duty_id: duty.raw_duty_id,
					};
				}),
		);

		// Upsert the updated rawDuty records into the database
		const { data: upsertedRawDuty, error: upsertedRawDutyError } =
			await supabase
				.from("raw_duty")
				.upsert(rawDutiesWithRawDutyPeriodIDs, {
					onConflict: "raw_duty_id",
					ignoreDuplicates: false,
				})
				.select();

		if (upsertedRawDutyError) {
			console.error("Error upserting raw_duty:", upsertedRawDutyError);
			throw upsertedRawDutyError;
		}

		console.log("Upserted raw_duty records:", upsertedRawDuty);

		// 11. Because we have upserted a partial set of raw_duty records, we need to get back all the raw_duty records for this roster
		const { data: rawDuty2, error: rawDuty2Error } = await supabase
			.from("raw_duty")
			.select("*")
			.eq("roster_id", rosterId);

		if (rawDuty2Error) {
			console.error("Error getting raw_duty:", rawDuty2Error);
			throw rawDuty2Error;
		}

		console.log("Raw_duty records:", rawDuty2);

		// 12. Update the roster record with raw_duty_ids and raw_duty_period_ids (calculated earlier)
		// NOTE: We might not need to do this depending on how we query the data later
		const { data: roster3, error: roster3Error } = await supabase
			.from("roster")
			.update({
				updated_at: new Date().toISOString(),
				raw_duty_ids: rawDutyIDs,
				raw_duty_period_ids: rawDutyPeriodIDs,
			})
			.eq("roster_id", rosterId)
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

		// ------------------------------------------------------------------------------------------------
		// IMPORT ROSTER FINISHED, BEGIN DUTY MATCHING
		// ------------------------------------------------------------------------------------------------

		// Now find current duties
		// At this point, data has been loaded into the database, we now start the matching process

		// DRAW.IO DUTY_MATCHING - 1. Import current data for roster period
		const { data: current_duty1, error: current_duty1Error } = await supabase
			.from("duty")
			.select("*")
			.eq("user_id", userID)
			.eq("is_current", true)
			.gte("date", formattedStartDate)
			.lte("date", formattedEndDate);

		if (current_duty1Error) {
			console.error("Error getting current duties:", current_duty1Error);
			throw current_duty1Error;
		}

		console.log("Current duties:", current_duty1);

		// 2. Begin matching of incoming duties to those that already exist and understand the
		// type of update
		const dutiesToUpsert = [];
		const dutiesToInsert = [];
		let dutyMatchesToInsert = [];
		const changeLogToInsert = [];

		// 2.1 Find corresponding current_duty to incoming raw_duty
		// Loop through rawDuty2
		for (const rawDuty of rawDuty2) {
			// Find the corresponding current_duty
			const correspondingCurrentDuty = current_duty1.find(
				(duty) =>
					duty.date === rawDuty.date &&
					duty.duty_type === rawDuty.duty_type &&
					duty.duty_code === rawDuty.duty_code &&
					duty.flight_number === rawDuty.flight_number,
			);
			if (correspondingCurrentDuty) {
				console.log(
					"Corresponding current duty found:",
					correspondingCurrentDuty,
				);
				// 2.2
				// Compare the current duty with the raw duty to see if any of the fields have changed

				const currentDutyForComparison = {
					report_time: correspondingCurrentDuty.report_time,
					start_time: correspondingCurrentDuty.start_time,
					end_time: correspondingCurrentDuty.end_time,
					debrief_time: correspondingCurrentDuty.debrief_time,
					delay_hhmm: correspondingCurrentDuty.delay_hhmm,
					is_all_day: correspondingCurrentDuty.is_all_day,
					flight_number: correspondingCurrentDuty.flight_number,
					origin: correspondingCurrentDuty.origin,
					destination: correspondingCurrentDuty.destination,
					aircraft: correspondingCurrentDuty.aircraft,
					registration: correspondingCurrentDuty.registration,
					gate: correspondingCurrentDuty.gate,
					stand: correspondingCurrentDuty.stand,
					expected_pax: correspondingCurrentDuty.expected_pax,
					distance_nm: correspondingCurrentDuty.distance_nm,
					is_positioning: correspondingCurrentDuty.is_positioning,
				};

				const rawDutyForComparison = {
					report_time: rawDuty.report_time,
					start_time: rawDuty.start_time,
					end_time: rawDuty.end_time,
					debrief_time: rawDuty.debrief_time,
					delay_hhmm: rawDuty.delay_hhmm,
					is_all_day: rawDuty.is_all_day,
					flight_number: rawDuty.flight_number,
					origin: rawDuty.origin,
					destination: rawDuty.destination,
					aircraft: rawDuty.aircraft,
					registration: rawDuty.registration,
					gate: rawDuty.gate,
					stand: rawDuty.stand,
					expected_pax: rawDuty.expected_pax,
					distance_nm: rawDuty.distance_nm,
					is_positioning: rawDuty.is_positioning,
				};

				if (!isEqual(currentDutyForComparison, rawDutyForComparison)) {
					console.log("Duty has changed:");
					// 2.2.2
					const changedFields = getObjectDiff(
						currentDutyForComparison,
						rawDutyForComparison,
					);
					console.log("Diff:", changedFields);

					// Invalidating the current duty
					dutiesToUpsert.push({
						...correspondingCurrentDuty,
						is_current: false,
						current_to: new Date().toISOString(),
						updated_at: new Date().toISOString(),
					});

					// Create a duty match record
					dutyMatchesToInsert.push({
						roster_id: rosterId,
						old_duty_id: correspondingCurrentDuty.duty_id,
						raw_duty_id: rawDuty.raw_duty_id,
						is_found: true,
						no_of_changes: changedFields.length,
						match_type:
							"Update" as Database["public"]["Enums"]["match_types"],
						date: rawDuty.date,
						//is_duty_period: false,
					});

					// Remove unused properties from rawDuty
					const {
						ecrew_duty_id,
						duty_id,
						raw_duty_period_id,
						raw_duty_id,
						roster_id,
						...dutyFieldsWithoutEcrewDutyIdAndDutyId
					} = rawDuty;

					// Create a new duty record
					dutiesToInsert.push({
						...dutyFieldsWithoutEcrewDutyIdAndDutyId,
						is_current: true,
						roster_ids: [rosterId],
						raw_duty_ids: [rawDuty.raw_duty_id],
					});

					// 2.2.2.1
					// Create a change log record for each changed data item and their values
					for (const field of changedFields) {
						changeLogToInsert.push({
							duty_date: rawDuty.date,
							roster_id: rosterId,
							user_id: userID,
							raw_duty_id: rawDuty.raw_duty_id,
							raw_duty_period_id: rawDuty.raw_duty_period_id,
							from_duty_id: correspondingCurrentDuty.duty_id,
							// We don't yet know the to_duty_id
							from_duty_period_id: correspondingCurrentDuty.duty_period_id,
							// We also don't know the to_duty_period_id
							change_code:
								"Update" as Database["public"]["Enums"]["change_codes"],
							data_item: field,
							// @ts-ignore
							from_value: currentDutyForComparison[field],
							// @ts-ignore
							to_value: rawDutyForComparison[field],
							// TODO: This will be the date the change needed to be picked up
							effective_change_date: new Date().toISOString(),
						});
					}
				} else {
					console.log("Duty has not changed:");
					// 2.2.1
					// The duty has not changed, so we need to update the roster_ids and raw_duty_ids
					dutiesToUpsert.push({
						...correspondingCurrentDuty,
						roster_ids: [
							...(correspondingCurrentDuty.roster_ids || []),
							rosterId,
						],
						raw_duty_ids: [
							...(correspondingCurrentDuty.raw_duty_ids || []),
							rawDuty.raw_duty_id,
						],
						updated_at: new Date().toISOString(),
					});

					dutyMatchesToInsert.push({
						roster_id: rosterId,
						duty_id: correspondingCurrentDuty.duty_id,
						raw_duty_id: rawDuty.raw_duty_id,
						is_found: true,
						no_of_changes: 0,
						match_type: "Match" as Database["public"]["Enums"]["match_types"],
						date: rawDuty.date,
						//is_duty_period: false,
					});
				}
			} else {
				console.log(
					"No corresponding current duty found for raw duty:",
					rawDuty,
				);
				// 2.3
				// These will be new duty records

				// Remove unused properties from rawDuty
				const {
					ecrew_duty_id,
					duty_id,
					raw_duty_period_id,
					raw_duty_id,
					roster_id,
					...dutyFieldsWithoutEcrewDutyIdAndDutyId
				} = rawDuty;

				dutiesToInsert.push({
					...dutyFieldsWithoutEcrewDutyIdAndDutyId,
					is_current: true,
					roster_ids: [rosterId],
					raw_duty_ids: [rawDuty.raw_duty_id],
				});

				dutyMatchesToInsert.push({
					roster_id: rosterId,
					raw_duty_id: rawDuty.raw_duty_id,
					is_found: false,
					match_type: "New" as Database["public"]["Enums"]["match_types"],
					date: rawDuty.date,
					//is_duty_period: false,
				});
			}
		}

		const oldDutyIds = [];

		// 3. Update remaining current duties to not be current
		for (const currentDuty of current_duty1) {
			// Find the corresponding raw duty
			const correspondingRawDuty = rawDuty2.find(
				(duty) =>
					duty.date === currentDuty.date &&
					duty.duty_type === currentDuty.duty_type &&
					duty.duty_code === currentDuty.duty_code &&
					duty.flight_number === currentDuty.flight_number,
			);

			// If there is no corresponding raw duty, then the current duty is no longer valid
			if (!correspondingRawDuty) {
				dutiesToUpsert.push({
					...currentDuty,
					is_current: false,
					current_to: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				});

				dutyMatchesToInsert.push({
					// Roster ID at which point the duty was removed
					roster_id: rosterId,
					old_duty_id: currentDuty.duty_id,
					raw_duty_id: null,
					// Whether a raw duty was matched to a current duty
					is_found: false,
					match_type: "Delete" as Database["public"]["Enums"]["match_types"],
					date: currentDuty.date,
					//is_duty_period: false,
				});

				// write old duty ids ready to populate the roster
				oldDutyIds.push(currentDuty.duty_id);

				// Create a change log record
				changeLogToInsert.push({
					duty_date: currentDuty.date,
					roster_id: rosterId,
					user_id: userID,
					raw_duty_id: null,
					raw_duty_period_id: null,
					from_duty_id: currentDuty.duty_id,
					from_duty_period_id: currentDuty.duty_period_id,
					change_code:
						"Delete" as Database["public"]["Enums"]["change_codes"],
					data_item: null,
					from_value: null,
					to_value: null,
					// TODO: This will be the date the change needed to be picked up
					effective_change_date: new Date().toISOString(),
				});
			}
		}

		// 4. Write everything to the database
		// Upsert these new duties into the database
		const { error: upsertedCurrentDutiesError } = await supabase
			.from("duty")
			.upsert(dutiesToUpsert, {
				onConflict: "duty_id",
				ignoreDuplicates: false,
			});

		if (upsertedCurrentDutiesError) {
			console.error("Error upserting duties:", upsertedCurrentDutiesError);
			throw upsertedCurrentDutiesError;
		}

		// Insert the duties into the database
		const { error: insertedCurrentDutiesError } = await supabase
			.from("duty")
			.insert(dutiesToInsert);

		if (insertedCurrentDutiesError) {
			console.error("Error inserting duties:", insertedCurrentDutiesError);
			throw insertedCurrentDutiesError;
		}

		// Get all those duties again
		const { data: currentDuty2, error: currentDuty2Error } = await supabase
			.from("duty")
			.select("*")
			.eq("user_id", userID)
			.eq("is_current", true)
			.gte("date", formattedStartDate)
			.lte("date", formattedEndDate);

		if (currentDuty2Error) {
			console.error("Error getting duties:", currentDuty2Error);
			throw currentDuty2Error;
		}

		// 5. Update and write roster to the database
		// write all duty ids ready to populate the roster
		const dutyIds = currentDuty2.map((duty) => duty.duty_id);

		// Update the roster record with duty_ids and old_duty_ids (calculated earlier)
		const { data: roster4, error: roster4Error } = await supabase
			.from("roster")
			.update({
				updated_at: new Date().toISOString(),
				duty_ids: dutyIds,
				old_duty_ids: oldDutyIds,
			})
			.eq("roster_id", rosterId)
			.select();

		if (roster4Error) {
			console.error(
				"Error updating duty_ids and old_duty_ids:",
				roster4Error,
			);
			throw roster4Error;
		}

		console.log("Roster updated with duty_ids and old_duty_ids:", roster4);

		// 6. Add duty IDs to duty matches where it is missing
		dutyMatchesToInsert = dutyMatchesToInsert.map((dutyMatch) => {
			if (dutyMatch.raw_duty_id && !dutyMatch.duty_id) {
				const dutyId = currentDuty2.find(
					(duty) => duty.raw_duty_ids?.includes(dutyMatch.raw_duty_id),
				)?.duty_id;
				return {
					...dutyMatch,
					duty_id: dutyId,
				};
			}
			return dutyMatch;
		});

		// 7. Also add all 'New' records to the change log
		dutyMatchesToInsert.forEach((dutyMatch) => {
			if (dutyMatch.match_type === "New") {
				changeLogToInsert.push({
					duty_date: dutyMatch.date,
					user_id: userID,
					roster_id: rosterId,
					raw_duty_id: dutyMatch.raw_duty_id,
					// This is not on the duty_match yet
					raw_duty_period_id: null,
					from_duty_id: null,
					from_duty_period_id: null,
					to_duty_id: dutyMatch.duty_id,
					// This is not on the duty_match yet
					to_duty_period_id: null,
					change_code: "New" as Database["public"]["Enums"]["change_codes"],
					data_item: null,
					from_value: null,
					to_value: null,
					// TODO: This will be the date the change needed to be picked up
					effective_change_date: new Date().toISOString(),
				});
			}
		});

		// 8. Do the same for the change log
		const completedChangeLogToInsert = changeLogToInsert.map((changeLog) => {
			if (changeLog.change_code === "Update") {
				const dutyId = dutyMatchesToInsert.find(
					(dutyMatch) => dutyMatch.raw_duty_id === changeLog.raw_duty_id,
				)?.duty_id;
				return {
					...changeLog,
					to_duty_id: dutyId,
				};
			}
			return changeLog;
		});

		// 10. Update the raw_duty records with the duty_id, writes to new array rawDutiesWithDutyIds
		const rawDutiesWithDutyIds = rawDuty2.map((rawDuty) => {
			const dutyId = currentDuty2.find(
				(duty) => duty.raw_duty_ids?.includes(rawDuty.raw_duty_id),
			)?.duty_id;
			return {
				...rawDuty,
				duty_id: dutyId,
			};
		});

		// 11. Upsert the raw_duty records into the database
		// NOTE: rawDuty3 has been skipped, we can change this later
		const { data: rawDuty4, error: rawDuty4Error } = await supabase
			.from("raw_duty")
			.upsert(rawDutiesWithDutyIds, {
				onConflict: "raw_duty_id",
				ignoreDuplicates: false,
			})
			.select();

		if (rawDuty4Error) {
			console.error("Error upserting raw_duty:", rawDuty4Error);
			throw rawDuty4Error;
		}

		console.log("Upserted raw_duty:", rawDuty4);

		// 12. Update raw_duty_period with dutyIds
		// Loop through rawDutyPeriodData and add the corresponding duty_ids matched by ecrew_duty_id to a new array
		const rawDutyPeriodDataWithDutyIds = [];
		for (const rawDutyPeriod of rawDutyPeriodWithRawIds) {
			const dutyIdsForPeriod = rawDuty4
				.filter((duty) => duty.ecrew_duty_id === rawDutyPeriod.ecrew_duty_id)
				.map((duty) => duty.duty_id);
			rawDutyPeriodDataWithDutyIds.push({
				...rawDutyPeriod,
				duty_ids: dutyIdsForPeriod.filter((id) => id !== null),
				// TODO: This won't work for sector count as it could include standbys
				//sectors: dutyIdsForPeriod.length, //hm new test
			});
		}

		// 13. Upsert the raw_duty_period records that now have duty_ids into the database
		const {
			data: rawDutyPeriodWithDutyIds,
			error: rawDutyPeriodUpdateError,
		} = await supabase
			.from("raw_duty_period")
			.upsert(rawDutyPeriodDataWithDutyIds, {
				onConflict: "raw_duty_period_id",
				ignoreDuplicates: false,
			})
			.select();

		if (rawDutyPeriodUpdateError) {
			console.error(
				"Error upserting raw_duty_period:",
				rawDutyPeriodUpdateError,
			);
			throw rawDutyPeriodUpdateError;
		}

		console.log(
			"Upserted raw_duty_period records:",
			rawDutyPeriodWithDutyIds,
		);

		// 	---------------------------------------------------------

		// 14. Insert the duty matches into the database
		const { data: currentDutyMatch2, error: currentDutyMatch2Error } =
			await supabase.from("duty_match").insert(dutyMatchesToInsert).select();

		if (currentDutyMatch2Error) {
			console.error("Error inserting duty matches:", currentDutyMatch2Error);
			throw currentDutyMatch2Error;
		}

		console.log("Inserted duty matches:", currentDutyMatch2);

		// 15. Insert the change log into the database
		const { data: changeLog2, error: changeLog2Error } = await supabase
			.from("change_log")
			.insert(completedChangeLogToInsert)
			.select();

		if (changeLog2Error) {
			console.error("Error inserting change log:", changeLog2Error);
			throw changeLog2Error;
		}

		console.log("Inserted change log:", changeLog2);

		// ------------------------------------------------------------------------------------------------
		// DUTY MATCHING FINISHED, BEGIN DUTY PERIOD MATCHING
		// ------------------------------------------------------------------------------------------------
		// 1. Find current duty periods (pre roster load  update) and bring back from the database to use in the
		// matching process
		const { data: current_duty_period1, error: current_duty_period1Error } =
			await supabase
				.from("duty_period")
				.select("*")
				.eq("user_id", userID)
				.eq("is_current", true)
				.gte("date", formattedStartDate)
				.lte("date", formattedEndDate);

		if (current_duty_period1Error) {
			console.error(
				"Error getting current duty periods:",
				current_duty_period1Error,
			);
			throw current_duty_period1Error;
		}

		console.log("Current duty periods:", current_duty_period1);

		//2. Begin matching of the raw duty periods that have been created from the
		// incoming raw duties to the duty periods that are already current in the database
		// and identify and apply the correct type of update
		const dutyPeriodsToUpsert = [];
		const dutyPeriodsToInsert = [];
		let dpDutyMatchesToInsert = [];
		const dpChangeLogToInsert = [];

		// 2.1 Find corresponding current_duty_period to incoming raw_duty_period
		// Loop through "raw duty period"
		for (const rawDutyPeriod of rawDutyPeriodWithDutyIds) {
			// Find the corresponding current_duty_period
			const correspondingCurrentDutyPeriod = current_duty_period1.find(
				(dutyPeriod) => dutyPeriod.date === rawDutyPeriod.date,
			);

			if (correspondingCurrentDutyPeriod) {
				console.log(
					"Corresponding current duty period found:",
					correspondingCurrentDutyPeriod.date, //correspondingCurrentDutyPeriod,
				);
				//2.2 Compare the current duty period  with the raw duty period
				//to see if any of the fields have changed
				const currentDutyPeriodForComparison = {
					report_time: correspondingCurrentDutyPeriod.report_time,
					start_time: correspondingCurrentDutyPeriod.start_time,
					end_time: correspondingCurrentDutyPeriod.end_time,
					debrief_time: correspondingCurrentDutyPeriod.debrief_time,
					sectors: correspondingCurrentDutyPeriod.sectors,
					includes_flights: correspondingCurrentDutyPeriod.includes_flights,
					includes_standby: correspondingCurrentDutyPeriod.includes_standby,
					duty_ids: correspondingCurrentDutyPeriod.duty_ids,
				};

				const rawDutyPeriodForComparison = {
					report_time: rawDutyPeriod.report_time,
					start_time: rawDutyPeriod.start_time,
					end_time: rawDutyPeriod.end_time,
					debrief_time: rawDutyPeriod.debrief_time,
					sectors: rawDutyPeriod.sectors, //sectors needs to be calculated
					includes_flights: rawDutyPeriod.includes_flights,
					includes_standby: rawDutyPeriod.includes_standby,
					duty_ids: rawDutyPeriod.duty_ids,
				};

				if (
					!isEqual(currentDutyPeriodForComparison, rawDutyPeriodForComparison)
					// 2.3 There has been a change to the duty period
				) {
					console.log("Duty Period has changed:");
					// 2.2.1 Duty Period fields have changed
					const changedFieldsDP = getObjectDiff(
						currentDutyPeriodForComparison,
						rawDutyPeriodForComparison,
					);
					console.log("Diff:", changedFieldsDP);

					// 2.2.1.1 Invalidating the current duty period
					dutyPeriodsToUpsert.push({
						sectors: correspondingCurrentDutyPeriod.sectors ?? 0,
						report_time: correspondingCurrentDutyPeriod.report_time,
						start_time: correspondingCurrentDutyPeriod.start_time,
						end_time: correspondingCurrentDutyPeriod.end_time,
						debrief_time: correspondingCurrentDutyPeriod.debrief_time,
						includes_flights: correspondingCurrentDutyPeriod.includes_flights,
						includes_standby: correspondingCurrentDutyPeriod.includes_standby,
						date: correspondingCurrentDutyPeriod.date,
						user_id: userID,
						//is_current: true,
						is_current: false, //hm
						duty_period_id: correspondingCurrentDutyPeriod.duty_period_id, //hm
						raw_duty_period_ids: [
							...correspondingCurrentDutyPeriod.raw_duty_period_ids,
							rawDutyPeriod.raw_duty_period_id,
						],
						duty_ids: [
							...(correspondingCurrentDutyPeriod?.duty_ids ?? []),
							...(rawDutyPeriod?.duty_ids ?? []),
						],
						roster_ids: [
							...correspondingCurrentDutyPeriod.roster_ids,
							rosterId,
						],
						current_to: new Date().toISOString(),
						updated_at: new Date().toISOString(),
					});

					// 2.2.1.2 Create a duty match record for the duty period
					dpDutyMatchesToInsert.push({
						roster_id: rosterId,
						old_duty_period_id: correspondingCurrentDutyPeriod.duty_period_id,
						raw_duty_period_id: rawDutyPeriod.raw_duty_period_id,
						is_found: true,
						// -1 as the duty_ids are not regarded as a change
						no_of_changes: changedFieldsDP.length - 1,
						match_type:
							"Update" as Database["public"]["Enums"]["match_types"],
						date: rawDutyPeriod.date,
						is_duty_period: true,
					});

					dutyPeriodsToInsert.push({
						// Removing fields from rawDutyPeriod that are not in the duty_period table
						sectors: rawDutyPeriod.sectors ?? 0,
						report_time: rawDutyPeriod.report_time,
						start_time: rawDutyPeriod.start_time,
						end_time: rawDutyPeriod.end_time,
						debrief_time: rawDutyPeriod.debrief_time,
						includes_flights: rawDutyPeriod.includes_flights,
						includes_standby: rawDutyPeriod.includes_standby,
						date: rawDutyPeriod.date,
						user_id: userID,
						is_current: true,
						roster_ids: [rosterId],
						raw_duty_period_ids: [rawDutyPeriod.raw_duty_period_id],
						duty_ids: rawDutyPeriod?.duty_ids ?? [],
					});

					// 2.2.1.4
					// Create a change log record for each changed data item and their values
					for (const field of changedFieldsDP) {
						dpChangeLogToInsert.push({
							duty_date: rawDutyPeriod.date,
							roster_id: rosterId,
							user_id: userID,
							raw_duty_period_id: rawDutyPeriod.raw_duty_period_id,
							from_duty_period_id:
								correspondingCurrentDutyPeriod.duty_period_id,
							// We don't yet know the to_duty_period_id
							change_code:
								"Update" as Database["public"]["Enums"]["change_codes"],
							data_item: field,
							// @ts-ignore
							from_value: currentDutyPeriodForComparison[field],
							// @ts-ignore
							to_value: rawDutyPeriodForComparison[field],
							// TODO: This will be the date the change needed to be picked up
							effective_change_date: new Date().toISOString(),
						});
					}
				} else {
					// 2.2.2.2 There has been no change to the duty period OR the duties within it
					// Upsert the duty period record with additional info
					dutyPeriodsToUpsert.push({
						sectors: correspondingCurrentDutyPeriod.sectors ?? 0,
						report_time: correspondingCurrentDutyPeriod.report_time,
						start_time: correspondingCurrentDutyPeriod.start_time,
						end_time: correspondingCurrentDutyPeriod.end_time,
						debrief_time: correspondingCurrentDutyPeriod.debrief_time,
						includes_flights: correspondingCurrentDutyPeriod.includes_flights,
						includes_standby: correspondingCurrentDutyPeriod.includes_standby,
						date: correspondingCurrentDutyPeriod.date,
						user_id: userID,
						is_current: true,
						updated_at: new Date().toISOString(),
						raw_duty_period_ids: [
							...correspondingCurrentDutyPeriod.raw_duty_period_ids,
							rawDutyPeriod.raw_duty_period_id,
						],
						duty_ids: [
							...(correspondingCurrentDutyPeriod?.duty_ids ?? []),
							...(rawDutyPeriod?.duty_ids ?? []),
						],
						roster_ids: [
							...correspondingCurrentDutyPeriod.roster_ids,
							rosterId,
						],
					});

					// 2.2.2.3 Create a duty match record for the duty period
					// HM ot sure the code is falling to here and its not happening?
					dpDutyMatchesToInsert.push({
						roster_id: rosterId,
						raw_duty_period_id: rawDutyPeriod.raw_duty_period_id,
						duty_period_id: correspondingCurrentDutyPeriod.duty_period_id,
						is_found: true,
						no_of_changes: 0,
						match_type: "Match" as Database["public"]["Enums"]["match_types"],
						date: rawDutyPeriod.date,
						is_duty_period: true,
					});
				}
			}
			// 2.3 There is no corresponding current duty period so must be new
			else {
				// 2.3.1 Create a new duty period record
				dutyPeriodsToInsert.push({
					// Removing fields from rawDutyPeriod that are not in the duty_period table
					sectors: rawDutyPeriod.sectors ?? 0,
					report_time: rawDutyPeriod.report_time,
					start_time: rawDutyPeriod.start_time,
					end_time: rawDutyPeriod.end_time,
					debrief_time: rawDutyPeriod.debrief_time,
					includes_flights: rawDutyPeriod.includes_flights,
					includes_standby: rawDutyPeriod.includes_standby,
					date: rawDutyPeriod.date,
					user_id: userID,
					is_current: true,
					roster_ids: [rosterId],
					raw_duty_period_ids: [rawDutyPeriod.raw_duty_period_id],
					duty_ids: rawDutyPeriod?.duty_ids ?? [],
				});

				// 2.3.2 Create a duty match record for the duty period
				dpDutyMatchesToInsert.push({
					roster_id: rosterId,
					raw_duty_period_id: rawDutyPeriod.raw_duty_period_id,
					// We don't yet know the duty_period_id
					duty_period_id: null,
					is_found: false,
					match_type: "New" as Database["public"]["Enums"]["match_types"],
					date: rawDutyPeriod.date,
					is_duty_period: true,
				});

				// 2.3.3 Create a change log record for the duty period
				dpChangeLogToInsert.push({
					duty_date: rawDutyPeriod.date,
					roster_id: rosterId,
					user_id: userID,
					raw_duty_period_id: rawDutyPeriod.raw_duty_period_id,
					change_code: "New" as Database["public"]["Enums"]["change_codes"],
					data_item: null,
					from_value: null,
					to_value: null,
					effective_change_date: new Date().toISOString(),
				});
			}
		}

		const oldDutyPeriodIds = [];

		// 3. Update remaining current duty periods to not be current
		for (const currentDutyPeriod of current_duty_period1) {
			// Find the corresponding raw duty period
			const correspondingRawDutyPeriod = rawDutyPeriodWithDutyIds.find(
				(rawDutyPeriod) => rawDutyPeriod.date === currentDutyPeriod.date,
			);

			// If there is no corresponding raw duty period, then the current duty period is no longer valid
			if (!correspondingRawDutyPeriod) {
				dutyPeriodsToUpsert.push({
					sectors: currentDutyPeriod.sectors ?? 0,
					report_time: currentDutyPeriod.report_time,
					start_time: currentDutyPeriod.start_time,
					end_time: currentDutyPeriod.end_time,
					debrief_time: currentDutyPeriod.debrief_time,
					includes_flights: currentDutyPeriod.includes_flights,
					includes_standby: currentDutyPeriod.includes_standby,
					date: currentDutyPeriod.date,
					user_id: userID,
					raw_duty_period_ids: currentDutyPeriod.raw_duty_period_ids,
					duty_ids: currentDutyPeriod?.duty_ids,
					roster_ids: currentDutyPeriod.roster_ids,
					is_current: false,
					current_to: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				});

				dpDutyMatchesToInsert.push({
					// Roster ID at which point the duty was removed
					roster_id: rosterId, //rosterId
					old_duty_period_id: currentDutyPeriod.duty_period_id,
					raw_duty_period_id: null,
					// Whether a raw record was matched to a current record
					is_found: false,
					match_type: "Delete" as Database["public"]["Enums"]["match_types"],
					date: currentDutyPeriod.date,
				});

				oldDutyPeriodIds.push(currentDutyPeriod.duty_period_id);

				// Create a change log record
				dpChangeLogToInsert.push({
					duty_date: currentDutyPeriod.date,
					roster_id: rosterId, //rosterId
					user_id: userID,
					raw_duty_id: null,
					raw_duty_period_id: null,
					from_duty_id: null,
					from_duty_period_id: currentDutyPeriod.duty_period_id,
					change_code:
						"Delete" as Database["public"]["Enums"]["change_codes"],
					data_item: null,
					from_value: null,
					to_value: null,
					// TODO: This will be the date the change needed to be picked up
					effective_change_date: new Date().toISOString(),
				});
			}
		}

		// Write everything to the database
		// 4. Upsert these new duty periods into the database
		console.log("Duty periods to insert:", dutyPeriodsToInsert);

		const { error: dutyPeriodsToInsertError } = await supabase
			.from("duty_period")
			// TODO: Not sure why there is a type error here
			.insert(dutyPeriodsToInsert);

		if (dutyPeriodsToInsertError) {
			console.error(
				"Error inserting duty periods:",
				dutyPeriodsToInsertError,
			);
			throw dutyPeriodsToInsertError;
		}

		const { error: dutyPeriodsToUpsertError } = await supabase
			.from("duty_period")
			.upsert(dutyPeriodsToUpsert, {
				onConflict: "duty_period_id",
				ignoreDuplicates: false,
			});

		if (dutyPeriodsToUpsertError) {
			console.error(
				"Error upserting duty periods:",
				dutyPeriodsToUpsertError,
			);
			throw dutyPeriodsToUpsertError;
		}

		// extract all those duty periods that have just been written to sql again
		const { data: currentDutyPeriod2, error: currentDutyPeriod2Error } =
			await supabase
				.from("duty_period")
				.select("*")
				.eq("user_id", userID)
				.eq("is_current", true)
				.gte("date", formattedStartDate)
				.lte("date", formattedEndDate);

		if (currentDutyPeriod2Error) {
			console.error("Error getting duty periods:", currentDutyPeriod2Error);
			throw currentDutyPeriod2Error;
		}

		// 5. Update and write roster to the database
		// write all duty ids ready to populate the roster
		const dutyPeriodIds = currentDutyPeriod2.map(
			(dutyPeriod) => dutyPeriod.duty_period_id,
		);

		// Update the roster record with duty_period_ids and old_duty_period_ids (calculated earlier)
		const { data: roster5, error: roster5Error } = await supabase
			.from("roster")
			.update({
				updated_at: new Date().toISOString(),
				duty_period_ids: dutyPeriodIds,
				old_duty_period_ids: oldDutyPeriodIds,
			})
			.eq("roster_id", rosterId)
			.select();

		if (roster5Error) {
			console.error(
				"Error updating duty_ids and old_duty_ids:",
				roster5Error,
			);
			throw roster5Error;
		}

		console.log(
			"Roster updated with duty_period_ids and old_duty_period_ids:",
			roster5,
		);

		// 6. Add duty period ids to duty matches where it is missing
		dpDutyMatchesToInsert = dpDutyMatchesToInsert.map((dpDutyMatch) => {
			if (dpDutyMatch.raw_duty_period_id && !dpDutyMatch.duty_period_id) {
				const dutyPeriodId = currentDutyPeriod2.find(
					(dutyPeriod) =>
						dutyPeriod.raw_duty_period_ids?.includes(
							dpDutyMatch.raw_duty_period_id,
						),
				)?.duty_period_id;
				return {
					...dpDutyMatch,
					duty_period_id: dutyPeriodId,
				};
			}
			return dpDutyMatch;
		});

		// 7. Add 'New' duty period changed records to the change log
		dpDutyMatchesToInsert.forEach((dpDutyMatch) => {
			if (dpDutyMatch.match_type === "New") {
				dpChangeLogToInsert.push({
					duty_date: dpDutyMatch.date,
					user_id: userID,
					roster_id: rosterId,
					raw_duty_period_id: dpDutyMatch.raw_duty_period_id,
					to_duty_period_id: dpDutyMatch.duty_period_id,
					raw_duty_id: null,
					from_duty_id: null,
					from_duty_period_id: null,
					change_code: "New" as Database["public"]["Enums"]["change_codes"],
					data_item: null,
					from_value: null,
					to_value: null,
					// TODO: This will be the date the change needed to be picked up
					effective_change_date: new Date().toISOString(),
				});
			}
		});

		// 8. Add the duty period id to all 'Updated' duty periods(s) in the change log
		const dpCompletedChangeLogToInsert = dpChangeLogToInsert.map(
			(dpChangeLog) => {
				if (dpChangeLog.change_code === "Update") {
					const dutyPeriodId = dpDutyMatchesToInsert.find(
						(dpDutyMatch) =>
							dpDutyMatch.raw_duty_period_id ===
							dpChangeLog.raw_duty_period_id,
					)?.duty_period_id;
					return {
						...dpChangeLog,
						to_duty_period_id: dutyPeriodId,
					};
				}
				return dpChangeLog;
			},
		);

		// 9. Update raw duty period with duty_period_id, writes to new array rawDutyPeriodsWithDutyPeriodId
		const rawDutyPeriodsWithDutyPeriodId = rawDutyPeriodDataWithDutyIds.map(
			(rawDutyPeriod) => {
				const dutyPeriodId = currentDutyPeriod2.find(
					(dutyPeriod) =>
						dutyPeriod.raw_duty_period_ids?.includes(
							rawDutyPeriod.raw_duty_period_id,
						),
				)?.duty_period_id;
				return {
					...rawDutyPeriod,
					duty_period_id: dutyPeriodId,
				};
			},
		);

		// 10. Upsert raw_duty_period into the database
		const { data: rawDutyPeriod4, error: rawDutyPeriod4Error } =
			await supabase
				.from("raw_duty_period")
				.upsert(rawDutyPeriodsWithDutyPeriodId, {
					onConflict: "raw_duty_period_id",
					ignoreDuplicates: false,
				})
				.select();

		if (rawDutyPeriod4Error) {
			console.error("Error upserting raw_duty_period:", rawDutyPeriod4Error);
			throw rawDutyPeriod4Error;
		}

		console.log("Upserted raw_duty_period:", rawDutyPeriod4);

		// 11. Add duty match into the database
		const { data: currentDutyMatch3, error: currentDutyMatch3Error } =
			await supabase
				.from("duty_match")
				.insert(dpDutyMatchesToInsert)
				.select();

		if (currentDutyMatch3Error) {
			console.error("Error inserting duty matches:", currentDutyMatch3Error);
			throw currentDutyMatch3Error;
		}

		console.log("Inserted duty (period) matches:", currentDutyMatch3);

		// 12. Add duty period change log records into the database
		const { data: changeLog3, error: changeLog3Error } = await supabase
			.from("change_log")
			.insert(dpCompletedChangeLogToInsert)
			.select();

		if (changeLog3Error) {
			console.error(
				"Error inserting dp changes into change log:",
				changeLog3Error,
			);
			throw changeLog3Error;
		}

		console.log("Duty periods Inserted change log:", changeLog3);

	}
	catch (error) {
		console.error("Error importing roster:", error);
		throw error;
	}
}
