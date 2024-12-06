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

		// Loop through raw_duty_period and extract the raw_duty_ids. We need an array of objects where the ID is the raw_duty_id and the value is the raw_duty_period_id
		const rawDutiesWithRawDutyPeriodIDs = raw_duty_period.flatMap((obj) =>
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
		const { data: rawDuty2, error: rawDuty2Error } = await supabase
			.from("raw_duty")
			.upsert(rawDutiesWithRawDutyPeriodIDs, {
				onConflict: "raw_duty_id",
				ignoreDuplicates: false,
			})
			.select();

		if (rawDuty2Error) {
			console.error("Error upserting raw_duty:", rawDuty2Error);
			throw rawDuty2Error;
		}

		console.log("Upserted raw_duty records:", rawDuty2);

		// Update the roster record with raw_duty_ids and raw_duty_period_ids (calculated earlier)
		// NOTE: We might not need to do this depending on how we query the data later
		const { data: roster3, error: roster3Error } = await supabase
			.from("roster")
			.update({
				updated_at: new Date().toISOString(),
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
						roster_id: rawDuty.roster_id,
						old_duty_id: correspondingCurrentDuty.duty_id,
						raw_duty_id: rawDuty.raw_duty_id,
						is_found: true,
						no_of_changes: changedFields.length,
						match_type: "Update" as Database["public"]["Enums"]["match_types"],
						date: rawDuty.date,
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
						roster_ids: [rawDuty.roster_id],
						raw_duty_ids: [rawDuty.raw_duty_id],
					});

					// 2.2.2.1
					// Create a change log record for each changed data item and their values
					for (const field of changedFields) {
						changeLogToInsert.push({
							duty_date: rawDuty.date,
							roster_id: rawDuty.roster_id,
							user_id: userID,
							raw_duty_id: rawDuty.raw_duty_id,
							raw_duty_period_id: rawDuty.raw_duty_period_id,
							from_duty_id: correspondingCurrentDuty.duty_id,
							// We don't yet know the to_duty_id
							from_duty_period_id: correspondingCurrentDuty.duty_period_id,
							// We also don't know the to_duty_period_id
							change_code: "update" as Database["public"]["Enums"]["change_codes"],
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
							rawDuty.roster_id,
						],
						raw_duty_ids: [
							...(correspondingCurrentDuty.raw_duty_ids || []),
							rawDuty.raw_duty_id,
						],
						updated_at: new Date().toISOString(),
					});

					dutyMatchesToInsert.push({
						roster_id: rawDuty.roster_id,
						duty_id: correspondingCurrentDuty.duty_id,
						raw_duty_id: rawDuty.raw_duty_id,
						is_found: true,
						no_of_changes: 0,
						match_type: "Match" as Database["public"]["Enums"]["match_types"],
						date: rawDuty.date,
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
					roster_ids: [rawDuty.roster_id],
					raw_duty_ids: [rawDuty.raw_duty_id],
				});

				dutyMatchesToInsert.push({
					roster_id: rawDuty.roster_id,
					raw_duty_id: rawDuty.raw_duty_id,
					is_found: false,
					match_type: "New" as Database["public"]["Enums"]["match_types"],
					date: rawDuty.date,
				});
			}
		}

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
					roster_id: roster3[0].roster_id,
					old_duty_id: currentDuty.duty_id,
					raw_duty_id: null,
					// Whether a raw duty was matched to a current duty
					is_found: false,
					match_type: "Delete" as Database["public"]["Enums"]["match_types"],
					date: currentDuty.date,
				});
			}
		}

		// 4. Write everything to the database
		// Upsert these new duties into the database
		const { data: currentDuty2, error: currentDuty2Error } = await supabase
			.from("duty")
			.upsert(dutiesToUpsert, {
				onConflict: "duty_id",
				ignoreDuplicates: false,
			})
			.select();

		if (currentDuty2Error) {
			console.error("Error inserting duties:", currentDuty2Error);
			throw currentDuty2Error;
		}

		console.log("Upserted duties:", currentDuty2);

		// Insert the duties into the database
		const { data: currentDuty3, error: currentDuty3Error } = await supabase
			.from("duty")
			.insert(dutiesToInsert)
			.select();

		if (currentDuty3Error) {
			console.error("Error inserting duties:", currentDuty3Error);
			throw currentDuty3Error;
		}

		console.log("Inserted duties:", currentDuty3);

		const combinedDuties = [...currentDuty2, ...currentDuty3];

		// 5. Add duty IDs to duty matches where it is missing
		dutyMatchesToInsert = dutyMatchesToInsert.map((dutyMatch) => {
			if (dutyMatch.raw_duty_id && !dutyMatch.duty_id) {
				const dutyId = combinedDuties.find(
					(duty) => duty.raw_duty_ids?.includes(dutyMatch.raw_duty_id),
				)?.duty_id;
				return {
					...dutyMatch,
					duty_id: dutyId
				};
			}
			return dutyMatch;
		});

		// Get all raw duties for this roster from the database
		const { data: rawDuty3, error: rawDuty3Error } = await supabase
			.from("raw_duty")
			.select("*")
			.eq("roster_id", roster3[0].roster_id);


		// Also update the raw_duty records with the duty_id
		const rawDutiesWithDutyIds = rawDuty2.map((rawDuty) => {
			const dutyId = combinedDuties.find(
				(duty) => duty.raw_duty_ids?.includes(rawDuty.raw_duty_id),
			)?.duty_id;
			return {
				...rawDuty,
				duty_id: dutyId
			};
		});

		// Upsert the raw_duty records into the database
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

		// Insert the duty matches into the database
		const { data: currentDutyMatch2, error: currentDutyMatch2Error } =
			await supabase.from("duty_match").insert(dutyMatchesToInsert).select();

		if (currentDutyMatch2Error) {
			console.error("Error inserting duty matches:", currentDutyMatch2Error);
			throw currentDutyMatch2Error;
		}

		console.log("Inserted duty matches:", currentDutyMatch2);

		// Insert the change log into the database
		const { data: changeLog2, error: changeLog2Error } = await supabase
			.from("change_log")
			.insert(changeLogToInsert)
			.select();

		if (changeLog2Error) {
			console.error("Error inserting change log:", changeLog2Error);
			throw changeLog2Error;
		}

		console.log("Inserted change log:", changeLog2);
	} catch (error) {
		console.error("Error importing roster:", error);
		throw error;
	}
}
