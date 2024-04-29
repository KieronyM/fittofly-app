/**
 * //+++++++++++++++++++++++++++++++++++++++
 * Calculate Cumulative Hours for Given Day:
 * //+++++++++++++++++++++++++++++++++++++++
 * Using the date sent, the total flight and Duty minutes will be calculated
 * for the FRM & FTL defined time periods (see cumulative-limits.md).
 * Created: March 2024(HF)  
 */

// utils
import { subDays, subMonths, subWeeks, startOfYear } from "date-fns";

// types
import { dailyMinutes } from "@/types";
import { cumulativeFlightAndDutyHours } from "@/types";


/**
 * calculate the sum of duty minutes for an allocated date range from dailyminutes

 */
function getTotalDutyMinsInRange(dailyMinutes: dailyMinutes[], startDate: Date, endDate: Date): number {
    const filteredDailyMinutes = dailyMinutes.filter((day) => new Date(day.dayDate) >= new Date(startDate)
        && new Date(day.dayDate) <= new Date(endDate))

    let sumOfDutyMinutes = 0;
    for (const day of filteredDailyMinutes) {
        sumOfDutyMinutes += day.dutyMinutes;
    }
    return sumOfDutyMinutes;
}

/**
 * calculate the sum of flight minutes for an allocated date range from dailyminutes

 */
function getTotalFlightMinsInRange(dailyMinutes: dailyMinutes[], startDate: Date, endDate: Date): number {
    const filteredDailyMinutes = dailyMinutes.filter((day) => new Date(day.dayDate) >= new Date(startDate)
        && new Date(day.dayDate) <= new Date(endDate))

    let sumOfFlightMinutes = 0;
    for (const day of filteredDailyMinutes) {
        sumOfFlightMinutes += day.flightMinutes;
    }
    return sumOfFlightMinutes;
}



// Main
export function calculateCumulativeHours(dailyMinutes: dailyMinutes[], givenDate: Date) {
    
    //const givenDate: Date = new Date(); 
    const givenDateDDMMYYYY = givenDate.toISOString().substring(0, 10);

    const cumulativeFlightAndDutyHours = [];
    let sumOfDutyMinutes: number;
    let sumOfFlightMinutes: number;
    let startDate: Date = new Date();
    let startDateDDMMYYYY: String;

    // Current Year
    startDate = startOfYear(new Date(givenDate));
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startDate, givenDate);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startDate, givenDate);

    startDateDDMMYYYY = startDate.toISOString().substring(0, 10);
    cumulativeFlightAndDutyHours.push({
        givenDate: givenDateDDMMYYYY, startDate: startDateDDMMYYYY, period: "current year", dutyMinutes: sumOfDutyMinutes, flightMinutes: sumOfFlightMinutes
    });

    // 6 months
    startDate = subMonths(new Date(givenDate), 5)
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startDate, givenDate);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startDate, givenDate);

    startDateDDMMYYYY = startDate.toISOString().substring(0, 10);
    cumulativeFlightAndDutyHours.push({
        givenDate: givenDateDDMMYYYY, startDate: startDateDDMMYYYY, period: "last 6 months", dutyMinutes: sumOfDutyMinutes, flightMinutes: sumOfFlightMinutes
    });

    // 9 months
    startDate = subMonths(new Date(givenDate), 8)
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startDate, givenDate);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startDate, givenDate);

    startDateDDMMYYYY = startDate.toISOString().substring(0, 10);
    cumulativeFlightAndDutyHours.push({
        givenDate: givenDateDDMMYYYY, startDate: startDateDDMMYYYY, period: "last 9 months", dutyMinutes: sumOfDutyMinutes, flightMinutes: sumOfFlightMinutes
    });
    
    // 12 weeks
    startDate = subWeeks(new Date(givenDate), 12)
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startDate, givenDate);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startDate, givenDate);

    startDateDDMMYYYY = startDate.toISOString().substring(0, 10);
    cumulativeFlightAndDutyHours.push({
        givenDate: givenDateDDMMYYYY, startDate: startDateDDMMYYYY, period: "last 12 weeks", dutyMinutes: sumOfDutyMinutes, flightMinutes: sumOfFlightMinutes
    });
    
    // 28 days
    startDate = subDays(new Date(givenDate), 27)
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startDate, givenDate);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startDate, givenDate);

    startDateDDMMYYYY = startDate.toISOString().substring(0, 10);
    cumulativeFlightAndDutyHours.push({
        givenDate: givenDateDDMMYYYY, startDate: startDateDDMMYYYY, period: "last 28 days", dutyMinutes: sumOfDutyMinutes, flightMinutes: sumOfFlightMinutes
    });

    // 14 days
    startDate = subDays(new Date(givenDate), 13)
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startDate, givenDate);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startDate, givenDate);

    startDateDDMMYYYY = startDate.toISOString().substring(0, 10);
    cumulativeFlightAndDutyHours.push({
        givenDate: givenDateDDMMYYYY, startDate: startDateDDMMYYYY, period: "last 14 days", dutyMinutes: sumOfDutyMinutes, flightMinutes: sumOfFlightMinutes
    });

    // 7 days
    startDate = subDays(new Date(givenDate), 6)
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startDate, givenDate);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startDate, givenDate);

    startDateDDMMYYYY = startDate.toISOString().substring(0, 10);
    cumulativeFlightAndDutyHours.push({
        givenDate: givenDateDDMMYYYY, startDate: startDateDDMMYYYY, period: "last 7 days", dutyMinutes: sumOfDutyMinutes, flightMinutes: sumOfFlightMinutes
    });

    return (cumulativeFlightAndDutyHours);
}