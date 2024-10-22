import { supabase } from "@/utils/supabase";

export interface eCrewDuty {
  // Define the structure of your event data here
  id: string;
  start: string;
  end: string;
  type: 'Flight' | 'Hotel' | 'Default' | 'Standby' | 'Training' | 'Off';
  IsDeadhead: boolean;
  // ... other fields
}

export interface eCrewFlight {
  originalDutyId: string;
  dutyDetails: {

  }; // Replace 'any' with a more specific type if possible
}

export async function importRoster(eCrewDutiesDetails: eCrewDuty[], eCrewFlightsDetails: eCrewFlight[]) {
  try {
    console.log('Importing roster...');
    console.log('eCrew Duties details:', eCrewDutiesDetails);
    console.log('eCrew Flights details:', eCrewFlightsDetails);

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
    const formattedStartDate = earliestStartDate.toISOString().split('T')[0];
    const formattedEndDate = latestEndDate.toISOString().split('T')[0];

    console.log('Earliest start date:', formattedStartDate);
    console.log('Latest end date:', formattedEndDate);

    // Create a roster - this will be a single record that will be inserted into the database
    const roster = {
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      user_id: '1624efbd-569f-4b49-abbb-fb7e62bac69d',
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
    const { data: rosterData, error: rosterError } = await supabase
      .from('roster')
      .insert(roster);

    if (rosterError) {
      console.error('Error inserting roster:', rosterError);
      throw rosterError;
    }

    console.log('Roster inserted:', rosterData);

    // Process duties into raw duties for SQL insert
    // const rawDuties = eCrewDutiesDetails.map(duty => ({
    //   duty_id: duty.id,
    //   // Map other fields as needed
    // }));

    // Process flights into raw flights for SQL insert
    // const rawFlights = eCrewFlightsDetails.map(flight => ({
    //   original_duty_id: flight.originalDutyId,
    //   duty_details: flight.dutyDetails,
    //   // Map other fields as needed
    // }));

    // Insert raw duties into SQL
    // const { data: dutiesData, error: dutiesError } = await supabase
    //   .from('raw_duty')
    //   .insert(rawDuties);

    // if (dutiesError) {
    //   console.error('Error inserting duties:', dutiesError);
    //   throw dutiesError;
    // }

    // Insert raw flights into SQL
    // const { data: flightsData, error: flightsError } = await supabase
    //   .from('raw_flight')
    //   .insert(rawFlights);

    // if (flightsError) {
    //   console.error('Error inserting flights:', flightsError);
    //   throw flightsError;
    // }

    // Next steps

  } catch (error) {
    console.error('Error importing roster:', error);
    throw error;
  }
}