/**
 * //+++++++++++++++++++++++++++++++
 * Cumulative Flight and Duty Hours:
 * //+++++++++++++++++++++++++++++++
 * Validates the Total Duty Time and Total Flight Time do not exceed 
 * OMA guidelines 7.1.6 for FTl rules and 7.4.10.3 for Roster B/FRM scheme
 * Uses the limits as defined in ezy_oma, and checks for each day where
 * there are duty hours using aggreagatedDailyMinutes (distinct on day)), 
 * then sums total minutes for the required period(s) from dailyMinutes and writes
 * values to respective array fro the period.
 * Duties and/or flight times exceeding defined limits written to totalTimeExceeded
 * Created: Nov 2023(HF) 
 */

// utils
import { convertTimeToMinutes } from "@/utils/times";
import {
    addHours, subHours, subDays, addWeeks, subWeeks,
    addMonths, subMonths, startOfMonth, endOfMonth,
    addYears, subYears, startOfYear, endOfYear
} from "date-fns";

// config
import {
    SEVEN_DAY_TOTAL_DUTY_HHMM,
    FOURTEEN_DAY_TOTAL_DUTY_HHMM,
    TWENTY_EIGHT_DAY_TOTAL_DUTY_HHMM,
    // RB_SEVEN_DAY_TOTAL_DUTY_HHMM //same as SEVEN_DAY_TOTAL_DUTY_HHMM
    RB_FOURTEEN_DAY_TOTAL_DUTY_HHMM,
    // RB_TWENTY_EIGHT_DAY_TOTAL_DUTY_HHMM same as TWENTY_EIGHT_DAY_TOTAL_DUTY_HHMM
    RB_TWELVE_WEEKS_TOTAL_DUTY_HHMM,
    RB_TWELVE_MONTHS_TOTAL_DUTY_HHMM,

    TWENTY_EIGHT_DAY_TOTAL_FLIGHT_HHMM,
    YEAR_TOTAL_FLIGHT_HHMM,
    TWELVE_MONTH_TOTAL_FLIGHT_HHMM,
    // RB_TWENTY_EIGHT_DAY_TOTAL_FLIGHT_HHMM same as TWENTY_EIGHT_DAY_TOTAL_FLIGHT_HHMM
    RB_TWELVE_WEEKS_TOTAL_FLIGHT_HHMM,
    RB_SIX_MONTHS_TOTAL_FLIGHT_HHMM,
    RB_NINE_MONTHS_TOTAL_FLIGHT_HHMM,
    RB_TWELVE_MONTHS_TOTAL_FLIGHT_HHMM


} from "@/config/ezy_oma";

// types
import {
    dailyMinutes, aggregatedDailyMinutes, cumulativeHoursExceeded,
    cumulative7DayHours, cumulative14DayHours, cumulative28DayHours, cumulative12WeekHours,
    cumulative6MonthHours, cumulative9MonthHours, cumulative12MonthHours, cumulative1YearHours
} from "@/types";

//convert time limits into minutes
const sevenDayTotalDutyMins = convertTimeToMinutes(SEVEN_DAY_TOTAL_DUTY_HHMM);
const fourteenDayTotalDutyMins = convertTimeToMinutes(FOURTEEN_DAY_TOTAL_DUTY_HHMM);
const twentyEightDayTotalDutyMins = convertTimeToMinutes(TWENTY_EIGHT_DAY_TOTAL_DUTY_HHMM);
const twentyEightDayTotalFlightMins = convertTimeToMinutes(TWENTY_EIGHT_DAY_TOTAL_FLIGHT_HHMM);
const yearTotalFlightMins = convertTimeToMinutes(YEAR_TOTAL_FLIGHT_HHMM);
const twelveMonthTotalFlightMins = convertTimeToMinutes(TWELVE_MONTH_TOTAL_FLIGHT_HHMM);

//const rbSevenDayTotalDutyMins = convertTimeToMinutes(RB_SEVEN_DAY_TOTAL_DUTY_HHMM);
const rbFourteenDayTotalDutyMins = convertTimeToMinutes(RB_FOURTEEN_DAY_TOTAL_DUTY_HHMM);
//const rbTwentyEightDayTotalDutyMins = convertTimeToMinutes(RB_TWENTY_EIGHT_DAY_TOTAL_DUTY_HHMM);
const rbTwelveWeeksTotalDutyMins = convertTimeToMinutes(RB_TWELVE_WEEKS_TOTAL_DUTY_HHMM);
const rbTwelveMonthsTotalDutyMins = convertTimeToMinutes(RB_TWELVE_MONTHS_TOTAL_DUTY_HHMM);

//const rb_TwentyEightDayTotalFlightMins = convertTimeToMinutes(RB_TWENTY_EIGHT_DAY_TOTAL_FLIGHT_HHMM);
const rbTwelveWeeksTotalFlightMins = convertTimeToMinutes(RB_TWELVE_WEEKS_TOTAL_DUTY_HHMM);
const rbSixMonthsTotalFlightMins = convertTimeToMinutes(RB_SIX_MONTHS_TOTAL_FLIGHT_HHMM);
const rbNineMonthsTotalFlightMins = convertTimeToMinutes(RB_NINE_MONTHS_TOTAL_FLIGHT_HHMM);
const rbTwelveMonthsTotalFlightMins = convertTimeToMinutes(RB_TWELVE_MONTHS_TOTAL_FLIGHT_HHMM);

const totalTimeExceeded: cumulativeHoursExceeded[] = [];

//calculate the sum of duty minutes for an allocated date range from dailyminutes
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

function writeToTotalTimeExceeded(scheme: 'FRM' | 'FTL', dutyType: 'flight' | 'duty',
    rule: "6 month flight limit" | "9 month flight limit" | "12 month flight limit" | "12 month duty limit" |
        "1 year flight total" | "7 day duty total" | "14 day duty total" | "28 day duty total" |
        "28 day flight total" | "12 week duty total" | "12 week flight total",
    startDate: Date, endDate: Date, dutyMinutes: number, flightMinutes: number): void {
    totalTimeExceeded.push({
        scheme: scheme, dutyType: dutyType, rule: rule,
        startDate: startDate.toISOString().substring(0, 10),
        endDate: endDate.toISOString().substring(0, 10),
        dutyMinutes: dutyMinutes,
        flightMinutes: flightMinutes
    });
}


//----------------------------------------------------------------------
// Main
export function validateCumulativeTimeLimts(dailyMinutes: dailyMinutes[],
    aggregatedDailyMinutes: aggregatedDailyMinutes[]) {

    const currentDate: Date = new Date();
    const startCurrentMonth = startOfMonth(currentDate);
    const endCurrentMonth = endOfMonth(currentDate);
    //console.log("current date: ", currentDate, " start current Month: ", startCurrentMonth, " end current month: ", endCurrentMonth);
    //console.log ();
    let startMonth: Date = new Date();
    let endMonth: Date = new Date();
    let extHours;

    let sumOfDutyMinutes: number;
    let sumOfFlightMinutes: number;


    // CURRENT 6 months, 9 month & 12 month totals
    startMonth = subMonths(new Date(startCurrentMonth), 5);
    //console.log(" start of month ", startMonth);

    //check to see if adjustment required for british summer time
    // by using startMonth, all the month checks will be bst fixed
    extHours = startMonth.toISOString().substring(11, 13);
    //console.log(extHours);
    if (extHours == '23') {
        startMonth = addHours(new Date(startMonth), 1);
    }
    if (extHours == '01') {
        startMonth = subHours(new Date(startMonth), 1);
    }


    endMonth = endCurrentMonth;
    //console.log(" current 6 months ", startMonth, " ", endMonth);


    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startMonth, endMonth);
    if (sumOfFlightMinutes >= rbSixMonthsTotalFlightMins) {
        writeToTotalTimeExceeded("FRM", "flight", "6 month flight limit",
            (new Date(startMonth)), (new Date(endMonth)),
            0, sumOfFlightMinutes);
    }

    startMonth = subMonths(startMonth, 3)
    //console.log(" current 9 months ", startMonth, " ", endMonth);
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startMonth, endMonth);
    if (sumOfFlightMinutes >= rbNineMonthsTotalFlightMins) {
        writeToTotalTimeExceeded("FRM", "flight", "9 month flight limit",
            (new Date(startMonth)), (new Date(endMonth)),
            0, sumOfFlightMinutes);
    }

    startMonth = subMonths(startMonth, 3)
    //console.log(" current 12 months ", startMonth, " ", endMonth);
    //console.log ("---------");
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startMonth, endMonth);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startMonth, endMonth);
    if (sumOfFlightMinutes >= twelveMonthTotalFlightMins) {
        writeToTotalTimeExceeded("FTL", "flight", "12 month flight limit",
            (new Date(startMonth)), (new Date(endMonth)),
            0, sumOfFlightMinutes);
    }
    if (sumOfDutyMinutes >= rbTwelveMonthsTotalDutyMins) {
        writeToTotalTimeExceeded("FRM", "duty", "12 month duty limit",
            (new Date(startMonth)), (new Date(endMonth)),
            sumOfDutyMinutes, 0);
    }
    if (sumOfFlightMinutes >= rbTwelveMonthsTotalFlightMins) {
        writeToTotalTimeExceeded("FRM", "flight", "12 month flight limit",
            (new Date(startMonth)), (new Date(endMonth)),
            0, sumOfFlightMinutes);
    }

    // NEXT 6 months, 9 month & 12 month totals
    //continued from current start month values so do not hve to repeat british summertime check
    startMonth = addMonths(startMonth, 7)
    endMonth = endOfMonth(new Date(currentDate));
    endMonth = addMonths(endMonth, 1);
    //console.log("6 months - next ", startMonth, " ", endMonth);

    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startMonth, endMonth);
    if (sumOfFlightMinutes >= rbSixMonthsTotalFlightMins) {
        writeToTotalTimeExceeded("FRM", "flight", "6 month flight limit",
            (new Date(startMonth)), (new Date(endMonth)),
            0, sumOfFlightMinutes);
    }

    startMonth = subMonths(startMonth, 3)
    //console.log("9 months - next", startMonth, " ", endMonth);
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startMonth, endMonth);
    if (sumOfFlightMinutes >= rbNineMonthsTotalFlightMins) {
        writeToTotalTimeExceeded("FRM", "flight", "9 month flight limit",
            (new Date(startMonth)), (new Date(endMonth)),
            0, sumOfFlightMinutes);
    }

    startMonth = subMonths(startMonth, 3)
    //console.log("12 months - next", startMonth, " ", endMonth);
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startMonth, endMonth);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startMonth, endMonth);
    if (sumOfFlightMinutes >= twelveMonthTotalFlightMins) {
        writeToTotalTimeExceeded("FTL", "flight", "12 month flight limit",
            (new Date(startMonth)), (new Date(endMonth)),
            0, sumOfFlightMinutes);
    }
    if (sumOfDutyMinutes >= rbTwelveMonthsTotalDutyMins) {
        writeToTotalTimeExceeded("FRM", "duty", "12 month duty limit",
            (new Date(startMonth)), (new Date(endMonth)),
            sumOfDutyMinutes, 0);
    }
    if (sumOfFlightMinutes >= rbTwelveMonthsTotalFlightMins) {
        writeToTotalTimeExceeded("FRM", "flight", "12 month flight limit",
            (new Date(startMonth)), (new Date(endMonth)),
            0, sumOfFlightMinutes);
    }
    //console.log("-------");

    // PREVIOUS 6 months, 9 month & 12 month totals
    startMonth = addMonths(startMonth, 4)
    endMonth = endOfMonth(new Date(currentDate));
    endMonth = subMonths(endMonth, 1);
    //console.log("6 months - previous ", startMonth, " ", endMonth);

    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startMonth, endMonth);
    if (sumOfFlightMinutes >= rbSixMonthsTotalFlightMins) {
        writeToTotalTimeExceeded("FRM", "flight", "6 month flight limit",
            (new Date(startMonth)), (new Date(endMonth)),
            0, sumOfFlightMinutes);
    }

    startMonth = subMonths(startMonth, 3)
    //console.log("9 months - previous", startMonth, " ", endMonth);
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startMonth, endMonth);
    if (sumOfFlightMinutes >= rbNineMonthsTotalFlightMins) {
        writeToTotalTimeExceeded("FRM", "flight", "9 month flight limit",
            (new Date(startMonth)), (new Date(endMonth)),
            0, sumOfFlightMinutes);
    }

    startMonth = subMonths(startMonth, 3)
    //console.log("12 months - previous", startMonth, " ", endMonth);
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startMonth, endMonth);
    sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, startMonth, endMonth);
    if (sumOfFlightMinutes >= twelveMonthTotalFlightMins) {
        writeToTotalTimeExceeded("FTL", "flight", "12 month flight limit",
            (new Date(startMonth)), (new Date(endMonth)),
            0, sumOfFlightMinutes);
    }
    if (sumOfDutyMinutes >= rbTwelveMonthsTotalDutyMins) {
        writeToTotalTimeExceeded("FRM", "duty", "12 month duty limit",
            (new Date(startMonth)), (new Date(endMonth)),
            sumOfDutyMinutes, 0);
    }
    if (sumOfFlightMinutes >= rbTwelveMonthsTotalFlightMins) {
        writeToTotalTimeExceeded("FRM", "flight", "12 month flight limit",
            (new Date(startMonth)), (new Date(endMonth)),
            0, sumOfFlightMinutes);
    }

    // Current Year
    const startCurrentYear = startOfYear(new Date(currentDate));
    const endCurrentYear = endOfYear(new Date(currentDate));
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startCurrentYear, endCurrentYear);
    //console.log(`Total Flight Minutes current year: ${sumOfFlightMins}`);
    if (sumOfFlightMinutes >= yearTotalFlightMins) {
        writeToTotalTimeExceeded("FTL", "flight", "1 year flight total",
            (new Date(startCurrentYear)), (new Date(endCurrentYear)),
            0, sumOfFlightMinutes);
    }

    // Previous Year
    const startPrevYear = subYears(startCurrentYear, 1);
    const endPrevYear = endOfYear(new Date(startPrevYear));
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startPrevYear, endPrevYear);
    //console.log(startPrevYear, ' ', endPrevYear, `Total Flight Minutes prev year: ${sumOfFlightMinutes}`);
    if (sumOfFlightMinutes >= yearTotalFlightMins) {
        writeToTotalTimeExceeded("FTL", "flight", "1 year flight total",
            (new Date(startPrevYear)), (new Date(endPrevYear)),
            0, sumOfFlightMinutes);
    }

    // Next Year (logically running this check is probably not necessary
    const startNextYear = addYears(startCurrentYear, 1);
    const endNextYear = endOfYear(new Date(startNextYear));
    sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, startNextYear, endNextYear);
    //console.log(startNextYear, " ", endNextYear, `Total Flight Minutes next year: ${sumOfFlightMinutes}`);
    if (sumOfFlightMinutes >= yearTotalFlightMins) {
        writeToTotalTimeExceeded("FTL", "flight", "1 year flight total",
            (new Date(startNextYear)), (new Date(endNextYear)),
            0, sumOfFlightMinutes);
    }


    //---------------------------------------------------------
    // loop around all duties 
    // no bst check as this is probably valid here, as searching 
    // in a day date range against specific duty dates
    for (const aggregatedDays of aggregatedDailyMinutes) {

        // 7 day duty 
        const daysAgo7 = subDays(new Date(aggregatedDays.dayDate), 6);
        sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, new Date(daysAgo7),
            new Date(aggregatedDays.dayDate));
        //console.log(` FUN Total duty Minutes 7 days: ${sumOfDutyMinutes}`);

        if (sumOfDutyMinutes >= sevenDayTotalDutyMins) {
            writeToTotalTimeExceeded("FTL", "duty", "7 day duty total",
                new Date(daysAgo7), new Date(aggregatedDays.dayDate),
                sumOfDutyMinutes, 0);
            //FTL & FRM limits currently the same for 7 day duty
            writeToTotalTimeExceeded("FRM", "duty", "7 day duty total",
                new Date(daysAgo7), new Date(aggregatedDays.dayDate),
                sumOfDutyMinutes, 0);
        }


        // 14 day duty 
        const daysAgo14 = subDays(new Date(aggregatedDays.dayDate), 13);
        sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, new Date(daysAgo14),
            new Date(aggregatedDays.dayDate));

        if (sumOfDutyMinutes >= fourteenDayTotalDutyMins) {
            writeToTotalTimeExceeded("FTL", "duty", "14 day duty total",
                new Date(daysAgo14), new Date(aggregatedDays.dayDate),
                sumOfDutyMinutes, 0);
        }
        if (sumOfDutyMinutes >= rbFourteenDayTotalDutyMins) {
            writeToTotalTimeExceeded("FRM", "duty", "14 day duty total",
                new Date(daysAgo14), new Date(aggregatedDays.dayDate),
                sumOfDutyMinutes, 0);
        }


        // ----------- 28 day duty, 28 day flight -----------------
        const daysAgo28 = subDays(new Date(aggregatedDays.dayDate), 27);
        sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, new Date(daysAgo28), new Date(aggregatedDays.dayDate));
        sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, new Date(daysAgo28), new Date(aggregatedDays.dayDate));

        if (sumOfDutyMinutes >= twentyEightDayTotalDutyMins) {
            writeToTotalTimeExceeded("FTL", "duty", "28 day duty total",
                new Date(daysAgo28), new Date(aggregatedDays.dayDate),
                sumOfDutyMinutes, 0);
            //FTL & FRM limits currently the same for 28 day duty
            writeToTotalTimeExceeded("FRM", "duty", "28 day duty total",
                new Date(daysAgo28), new Date(aggregatedDays.dayDate),
                sumOfDutyMinutes, 0);
        }

        if (sumOfFlightMinutes >= twentyEightDayTotalFlightMins) {
            writeToTotalTimeExceeded("FTL", "flight", "28 day flight total",
                new Date(daysAgo28), new Date(aggregatedDays.dayDate),
                0, sumOfFlightMinutes);
            //FTL & FRM limits currently the same for 28 day flight
            writeToTotalTimeExceeded("FRM", "flight", "28 day flight total",
                new Date(daysAgo28), new Date(aggregatedDays.dayDate),
                0, sumOfFlightMinutes);
        }

        // 12 weeks flight & duty 
        const weeksAgo12 = subWeeks(new Date(aggregatedDays.dayDate), 12);
        sumOfDutyMinutes = getTotalDutyMinsInRange(dailyMinutes, new Date(weeksAgo12), new Date(aggregatedDays.dayDate));
        sumOfFlightMinutes = getTotalFlightMinsInRange(dailyMinutes, new Date(weeksAgo12), new Date(aggregatedDays.dayDate));
        //console.log(aggregatedDays.dayDate, " ", weeksAgo12);

        if (sumOfDutyMinutes >= rbTwelveWeeksTotalDutyMins) {
            writeToTotalTimeExceeded("FRM", "duty", "12 week duty total",
                new Date(weeksAgo12), new Date(aggregatedDays.dayDate),
                sumOfDutyMinutes, 0);
        }
        if (sumOfFlightMinutes >= rbTwelveWeeksTotalFlightMins) {
            writeToTotalTimeExceeded("FRM", "flight", "12 week flight total",
                new Date(weeksAgo12), new Date(aggregatedDays.dayDate),
                sumOfFlightMinutes, 0);
        }
    }
    return (totalTimeExceeded);

}
