//+++++++++++++++++++++++++++++++++++++++++
// Calculate Current Flight And Duty Totals:
//+++++++++++++++++++++++++++++++++++++++++
// This is for information only
// Using the current day will return the total flight and Duty minutes
// for last week, fortnight, 28 days and year
// Created: Dec 2023(HF) 

// utils
import { subDays, subMonths, subWeeks, startOfYear } from "date-fns";

// types
import { dailyMinutes } from "@/types";
import { currentFlightAndDutyTotals } from "@/types";


//calculate the sum of duty minutes for an allocated date range from dailyminutes
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

//calculate the sum of flight minutes for an allocated date range from dailyminutes
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
export function calculateCurrentFlightAndDutyTotals(dailyMinutes: dailyMinutes[]) {

    const currentDate: Date = new Date();
    const currenDateDDMMYYYY = currentDate.toISOString().substring(0, 10);
    const currentFlightAndDutyTotals = [];
    let sumOfDutyMinutes: number;
    let sumOfFlightMinutes: number;
    let startDate: Date = new Date();
    let startDateDDMMYYYY: String;

    // Current Year
    startDate = startOfYear(new Date(currentDate));
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startDate, currentDate);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startDate, currentDate);

    startDateDDMMYYYY = startDate.toISOString().substring(0, 10);
    currentFlightAndDutyTotals.push({
        date: currenDateDDMMYYYY, startDate: startDateDDMMYYYY, period: "current year", dutyMinutes: sumOfDutyMinutes, flightMinutes: sumOfFlightMinutes
    });

    // Current 6 months
    startDate = subMonths(new Date(currentDate), 5)
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startDate, currentDate);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startDate, currentDate);

    startDateDDMMYYYY = startDate.toISOString().substring(0, 10);
    currentFlightAndDutyTotals.push({
        date: currenDateDDMMYYYY, startDate: startDateDDMMYYYY, period: "last 6 months", dutyMinutes: sumOfDutyMinutes, flightMinutes: sumOfFlightMinutes
    });

    // Current 9 months
    startDate = subMonths(new Date(currentDate), 8)
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startDate, currentDate);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startDate, currentDate);

    startDateDDMMYYYY = startDate.toISOString().substring(0, 10);
    currentFlightAndDutyTotals.push({
        date: currenDateDDMMYYYY, startDate: startDateDDMMYYYY, period: "last 9 months", dutyMinutes: sumOfDutyMinutes, flightMinutes: sumOfFlightMinutes
    });
    
    // Current 12 weeks
    startDate = subWeeks(new Date(currentDate), 12)
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startDate, currentDate);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startDate, currentDate);

    startDateDDMMYYYY = startDate.toISOString().substring(0, 10);
    currentFlightAndDutyTotals.push({
        date: currenDateDDMMYYYY, startDate: startDateDDMMYYYY, period: "last 12 weeks", dutyMinutes: sumOfDutyMinutes, flightMinutes: sumOfFlightMinutes
    });
    
    // Current 28 days
    startDate = subDays(new Date(currentDate), 27)
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startDate, currentDate);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startDate, currentDate);

    startDateDDMMYYYY = startDate.toISOString().substring(0, 10);
    currentFlightAndDutyTotals.push({
        date: currenDateDDMMYYYY, startDate: startDateDDMMYYYY, period: "last 28 days", dutyMinutes: sumOfDutyMinutes, flightMinutes: sumOfFlightMinutes
    });

    // Current 14 days
    startDate = subDays(new Date(currentDate), 13)
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startDate, currentDate);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startDate, currentDate);

    startDateDDMMYYYY = startDate.toISOString().substring(0, 10);
    currentFlightAndDutyTotals.push({
        date: currenDateDDMMYYYY, startDate: startDateDDMMYYYY, period: "last 14 days", dutyMinutes: sumOfDutyMinutes, flightMinutes: sumOfFlightMinutes
    });

    // Current 7 days
    startDate = subDays(new Date(currentDate), 6)
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startDate, currentDate);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startDate, currentDate);

    startDateDDMMYYYY = startDate.toISOString().substring(0, 10);
    currentFlightAndDutyTotals.push({
        date: currenDateDDMMYYYY, startDate: startDateDDMMYYYY, period: "last 7 days", dutyMinutes: sumOfDutyMinutes, flightMinutes: sumOfFlightMinutes
    });

    return (currentFlightAndDutyTotals);
}








