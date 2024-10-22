// utils
import { supabase } from "@/utils/supabase";

//----------------------------------------------------------------------
// RUN

export async function lookupMaxFDP(dutyStartTime: string, sectorCount: number) {
  // Start time and sector counts come in as variables.
  // Duty start time must be in format hh:mm
  // Sector count must be a number between 1 and 10

  // Fetches the max FDP from the database
  let { data, error } = await supabase
    // This is the table name
    .from("ezy_max_fdp")
    // This is teh column that we want
    .select("max_fdp")
    // Crew type - we can change these with different airlines/rules
    // e.g the more restrictive BALPA ones will be "uk_pilot_balpa"
    .eq("crew_type", "uk_pilot_oma")
    // Use the sector count from earlier
    .eq("sector_count", sectorCount)
    // period_start_time is less than or equal to dutyStartTime
    .lte("period_start_time", dutyStartTime)
    // period_finish_time is greater than or equal to dutyStartTime
    .gte("period_finish_time", dutyStartTime);

  // Handle any error
  if (error) {
    console.error(error);
  }

  // Shows you the raw result that comes back from the database
  // Should be just the one record!
  //console.log(data);

  // This gets the 0th element of the array and then the max_fdp key
  // and returns it.
  return data?.[0].max_fdp as string;
}