//++++++++++++++++++++++++
// calculate Daily Minutes
//++++++++++++++++++++++++
// Calculates the duty and flight minutes for each day where there is a duty
// and writes out to dailyMinutes, which may have multiple entries for the  
// same day and aggreagtedDailyMinutes where there will only be one entry
// for a day

// types
import { aggregatedDailyMinutes, dailyMinutes, dutyPeriod } from "@/types";

import { convertTimeToMinutes } from "@/utils/times";
import { areDatesOnSameLocalDay } from "./areDatesOnSameDay";
import { addDays } from "date-fns";
import { formatInTimeZone, zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";

export async function calculateDailyMinutes(upcomingDutyPeriods: dutyPeriod[]) {
    const dailyMinutes: dailyMinutes[] = [];

    let timeDiff;
    let dayDate;
    let dayDutyMinutes;
    let dayFlightMinutes;
    let day1FlightMinutes;
    let day2DutyMinutes;
    let day2FlightMinutes;
    let dutyPeriodID;
    let sameDay = false;
    let midnight;
    let minutesUntilMidnight


    for (const dutyPeriod of upcomingDutyPeriods) {
        //Times are in zulu. therefore if in BST, 23:00Z is midnight
        sameDay = areDatesOnSameLocalDay(new Date(dutyPeriod.reportTime), new Date(dutyPeriod.debriefTime));

        // Get the next day
        const nextDay = addDays(new Date(dutyPeriod.reportTime), 1);
        const nextDayDDMMYYYY = nextDay.toISOString().substring(0, 10);
        const nextDayMidnight = zonedTimeToUtc(`${nextDayDDMMYYYY} 00:00:00`, 'Europe/London');// Create a new date which is on the above date at midnight in London
        midnight = zonedTimeToUtc(`${nextDayDDMMYYYY} 00:00:00`, 'Europe/London');
        // Both Duty period and Flight period are calculated from Report Time
        minutesUntilMidnight = (midnight.getTime() - (new Date(dutyPeriod.reportTime)).getTime()) / (1000 * 60);

        dayDutyMinutes = convertTimeToMinutes(dutyPeriod.dutyPeriodHHMM);
        dayFlightMinutes = convertTimeToMinutes(dutyPeriod.flightDutyPeriodHHMM);
        dayDate = dutyPeriod.reportTime.toString().split('T')[0];
        dutyPeriodID = dutyPeriod.dutyPeriodID;

        if (sameDay) {
            dailyMinutes.push({
                timeZone: "local",
                dayDate: dayDate,
                dutyMinutes: dayDutyMinutes,
                flightMinutes: dayFlightMinutes,
                dutyPeriodID: dutyPeriodID
            })

        } else {
            //duty spans 2 days
            const day1DutyMinutes = minutesUntilMidnight;
            day2DutyMinutes = (dayDutyMinutes - minutesUntilMidnight);
            //flight may finish on same day even if duty does not as uses end date not debrief date
            if (minutesUntilMidnight < dayFlightMinutes) {
                day1FlightMinutes = minutesUntilMidnight;
                day2FlightMinutes = (dayFlightMinutes - minutesUntilMidnight);
            } else {
                day1FlightMinutes = dayFlightMinutes;
                day2FlightMinutes = 0;
            }
            //day 1 minutes
            dailyMinutes.push({
                timeZone: "local",
                dayDate: dayDate,
                dutyMinutes: day1DutyMinutes,
                flightMinutes: day1FlightMinutes,
                dutyPeriodID: dutyPeriodID
            })
            //day 2 - minutes that have run into the next day
            dailyMinutes.push({
                timeZone: "local",
                dayDate: nextDayDDMMYYYY,
                dutyMinutes: day2DutyMinutes,
                flightMinutes: day2FlightMinutes,
                dutyPeriodID: dutyPeriodID
            })
        }
        dutyPeriodID = 0;
    };

    //Aggregate daily minutes so only 1 object per day
    const aggregatedDays = dailyMinutes.reduce((group, day) => {
        const { dayDate } = day;
        // @ts-ignore
        group[dayDate] = group[dayDate] ?? [];
        // @ts-ignore
        group[dayDate].push(day);
        return group;
    }, {});

    // Now collect the data we are interested in 
    const aggregatedDailyMinutes: aggregatedDailyMinutes[] = [];

    Object.keys(aggregatedDays).forEach(key => {
        const newData = {
            // @ts-ignore
            timeZone: aggregatedDays[key][0].timeZone,
            // @ts-ignore
            dayDate: aggregatedDays[key][0].dayDate,
            dutyMinutes: 0,
            flightMinutes: 0,
            dutyPeriodIDs: []
        };

        // @ts-ignore
        for (const day of aggregatedDays[key]) {
            newData.dutyMinutes += day.dutyMinutes;
            newData.flightMinutes += day.flightMinutes;
            newData.dutyPeriodIDs = newData.dutyPeriodIDs.concat(day.dutyPeriodIds) //this isnt working
        }

        aggregatedDailyMinutes.push(newData);
    });

    return {
        dailyMinutes,
        aggregatedDailyMinutes
    }
}

