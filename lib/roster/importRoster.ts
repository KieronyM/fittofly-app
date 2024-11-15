import { ECrewDuty, ECrewFlight } from "@/types/eCrew";
import { supabase } from "@/utils/supabase";
import { findEarliestStartAndLatestEnd } from "@/utils/times";

export async function importRoster(eCrewDutiesDetails: ECrewDuty[], eCrewFlightsDetails: ECrewFlight[]) {
  try {
    console.log('Importing roster...');
    console.log('eCrew Duties details:', eCrewDutiesDetails);
    console.log('eCrew Flights details:', eCrewFlightsDetails);

    // Temporarily set a default user ID
    const userID = '1624efbd-569f-4b49-abbb-fb7e62bac69d';

    const { formattedStartDate, formattedEndDate } = findEarliestStartAndLatestEnd(eCrewDutiesDetails);

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
      flight_ids: [],
      old_flight_ids: [],
      raw_flight_ids: [],
    };

    // Insert roster into SQL
    // roster2 is the roster1 object with a unique ID and a created_at timestamp
    const { data: roster2, error: rosterError } = await supabase
      .from('roster')
      .insert(roster1)
      .select();

    if (rosterError) {
      console.error('Error inserting roster:', rosterError);
      throw rosterError;
    }

    console.log('Roster inserted:', roster2);

    // Loop through eCrewDutiesDetails to create rawDutyData
    // and for types of flight, also create corresponding
    // rawFlightData
    const rawDutyData = [];
    const rawDutyIDs = [];
    const rawFlightData = [];

    // Loop through eCrewDutiesDetails ready to insert into raw_duty
    for (const eCrewDutyDetails of eCrewDutiesDetails) {
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
        report_time: eCrewDutyDetails.type === 'Flight' ? eCrewDutyDetails.start : null,
        start_time: eCrewDutyDetails.start,
        end_time: eCrewDutyDetails.end,
        debrief_time: eCrewDutyDetails.type === 'Flight' ? eCrewDutyDetails.end : null,
        // TODO: Check this data is valid
        is_all_day: eCrewDutyDetails.all_day === 1 ? true : false
      });
    }

    // Insert raw_duty records into database
    const { data: raw_duty, error: rawDutyError } = await supabase
      .from('raw_duty')
      .insert(rawDutyData)
      .select();

    if (rawDutyError) {
      console.error('Error inserting raw_duty:', rawDutyError);
      throw rawDutyError;
    }

    console.log('Inserted raw_duty records:', raw_duty);

    // Loop through raw_duty and eCrewFlightsDetails to create raw_flight records
    for (const rawDutyFlights of raw_duty) {
      // Push to the array of rawDutyIDs to update the roster record later
      rawDutyIDs.push(rawDutyFlights.raw_duty_id);

      if (rawDutyFlights.duty_type === 'Flight') {
        // Find asssociated eCrewFlightDetails records
        const associatedFlights = eCrewFlightsDetails.filter(obj => obj.originalDutyId === rawDutyFlights.ecrew_duty_id)

        for (const associatedFlight of associatedFlights[0].dutyDetails) {
          rawFlightData.push({
            raw_duty_id: rawDutyFlights.raw_duty_id,
            flight_number: associatedFlight.FlightNumber,
            origin: associatedFlight.DepStation,
            destination: associatedFlight.ArrStation,
            // TODO: This data is incorrect for now, later it should come from the flight details
            report_time: rawDutyFlights.report_time,
            start_time: rawDutyFlights.start_time,
            end_time: rawDutyFlights.end_time,
            debrief_time: rawDutyFlights.debrief_time,
            delay_hhmm: associatedFlight.Delay,
            aircraft: associatedFlight.AcType,
            registration: associatedFlight.Registration,
            gate: associatedFlight.Gate,
            stand: associatedFlight.Stand,
            expected_pax: associatedFlight.ExpPax,
            distance_nm: parseFloat(associatedFlight.Distance.replace(" Nm", "")),
            is_positioning: associatedFlight.IsDeadhead
          });
        }

      }
    }

    // Insert raw_flight records into database
    const { data: raw_flight, error: rawFlightError } = await supabase
      .from('raw_flight')
      .insert(rawFlightData)
      .select();

    if (rawFlightError) {
      console.error('Error inserting raw_flight:', rawFlightError);
      throw rawFlightError;
    }

    console.log('Inserted raw_flight records:', raw_flight);

    // Get ALL raw_flight IDs to attach to roster
    const rawFlightIDs = raw_flight.map(obj => obj.raw_flight_id);

    // Update the roster record with raw_duty_ids (calculated earlier) and raw_flight_ids
    // NOTE: We might not need to do this depending on how we query the data later
    // roster3 is the roster2 object with the raw_duty_ids and raw_flight_ids updated
    const { data: roster3, error: roster3Error } = await supabase
      .from('roster')
      .update({ raw_duty_ids: rawDutyIDs, raw_flight_ids: rawFlightIDs })
      .eq('roster_id', roster2[0].roster_id)
      .select();

    if (roster3Error) {
      console.error('Error updating raw_duty_ids and raw_flight_ids:', roster3Error);
      throw roster3Error;
    }

    console.log('Roster updated with raw_duty_ids and raw_flight_ids:', roster3);

    // We also need to write back raw_flight_id to the raw_duty


  } catch (error) {
    console.error('Error importing roster:', error);
    throw error;
  }
}