//+++++++++++++++++++
// combined duty type
//+++++++++++++++++++
// Identifies duties which disrupt sleep.
// 7.1.2.7 Disruptive Schedule: A schedule may be disrupted due to Early Start, Late Finish 
// or Night Duties
// 7.1.2.7 Early Start & Late Finish
// 7.1.2.8 Night Duty & Night Start
//
// writes out to array disruptiveDuties
//
//// Identifies the type of duty and updates duty period
// 7.4.2.4 easyJet Early Start
// 7.4.2.5 easyJet Late Finish
// 7.2.6.6 easyJet disruptive duty (same condition as 7.1.2.7 though described differently)
// 7.4.2.7 easyJet Night Finish
// 7.4.2.8 Morning Duty
// 7.4.2.9 Eveniing Duty
// 7.4.2.10 Dual Duty
// 7.4.2.11 Neutral Duty


//utils
import { convertTimeToMinutes } from "@/utils/times";
import { isSameDay } from "date-fns";
// config
import { EARLY_START_BEGIN_HHMM, EARLY_START_END_HHMM, LATE_FINISH_BEGIN_HHMM, LATE_FINISH_END_HHMM, NIGHT_DUTY_BEGIN_HHMM, NIGHT_DUTY_END_HHMM } from "@/config/ezy_oma";
import {
    EZY_EARLY_START_BEGIN_HHMM, EZY_EARLY_START_END_HHMM, EZY_LATE_FINISH_BEGIN_HHMM, EZY_LATE_FINISH_END_HHMM,
    EZY_DISRUPTIVE_BEGIN_HHMM, EZY_DISRUPTIVE_END_HHMM, EZY_NIGHT_FINISH_BEGIN_HHMM, EZY_NIGHT_FINISH_END_HHMM,
    MORN_DUTY_START_BEGIN_HHMM, MORN_DUTY_START_END_HHMM, MORN_DUTY_END_HHMM, EVE_DUTY_BEGIN_HHMM, EVE_DUTY_END_HHMM,
    DUAL_DUTY_START_BEGIN_HHMM, DUAL_DUTY_START_END_HHMM, DUAL_DUTY_END_HHMM, NEUTRAL_DUTY_BEGIN_HHMM, NEUTRAL_DUTY_END_HHMM
} from "@/config/ezy_oma";
// types
import { dutyPeriod } from "@/types";


/**
 * sets the duty type in duty period and writes disruptive duty periods out to an array

 */
// Distruption Schedule is a roster which disrupts sleep.
export function setDutyType(upcomingDutyPeriods: dutyPeriod) {
    // Create an empty array for processed duty information
    const disruptiveDuties = [];

    // Convert times into minutes
    const earlyStartBeginMins = convertTimeToMinutes(EARLY_START_BEGIN_HHMM);
    const earlyStartEndMins = convertTimeToMinutes(EARLY_START_END_HHMM);
    const lateFinishBeginMins = convertTimeToMinutes(LATE_FINISH_BEGIN_HHMM);
    const lateFinishEndMins = convertTimeToMinutes(LATE_FINISH_END_HHMM);
    const nightDutyBeginMins = convertTimeToMinutes(NIGHT_DUTY_BEGIN_HHMM);
    const nightDutyEndMins = convertTimeToMinutes(NIGHT_DUTY_END_HHMM);

    const ezyEarlyStartBeginMins = convertTimeToMinutes(EZY_EARLY_START_BEGIN_HHMM);
    const ezyEarlyStartEndMins = convertTimeToMinutes(EZY_EARLY_START_END_HHMM);

    const ezyLateFinishBeginMins = convertTimeToMinutes(EZY_LATE_FINISH_BEGIN_HHMM);
    const ezyLateFinishEndMins = convertTimeToMinutes(EZY_LATE_FINISH_END_HHMM);

    const ezyDisruptiveBeginMins = convertTimeToMinutes(EZY_DISRUPTIVE_BEGIN_HHMM);
    const ezyDisruptiveEndMins = convertTimeToMinutes(EZY_DISRUPTIVE_END_HHMM);

    const ezyNightFinishBeginMins = convertTimeToMinutes(EZY_NIGHT_FINISH_BEGIN_HHMM);
    const ezyNightFinishEndMins = convertTimeToMinutes(EZY_NIGHT_FINISH_END_HHMM);

    const MornDutyBeginMins = convertTimeToMinutes(MORN_DUTY_START_BEGIN_HHMM);
    const MornDutyStartEndMins = convertTimeToMinutes(MORN_DUTY_START_END_HHMM);
    const MornDutyEndMins = convertTimeToMinutes(MORN_DUTY_END_HHMM);

    const eveDutyBeginMins = convertTimeToMinutes(EVE_DUTY_BEGIN_HHMM);
    const eveDutyEndMins = convertTimeToMinutes(EVE_DUTY_END_HHMM);

    const dualDutyBeginMins = convertTimeToMinutes(DUAL_DUTY_START_BEGIN_HHMM);
    const dualDutyStartEndMins = convertTimeToMinutes(DUAL_DUTY_START_END_HHMM);
    const dualDutyEndMins = convertTimeToMinutes(DUAL_DUTY_END_HHMM);

    const neutralDutyBeginMins = convertTimeToMinutes(NEUTRAL_DUTY_BEGIN_HHMM);
    const neutralDutyEndMins = convertTimeToMinutes(NEUTRAL_DUTY_END_HHMM);

    for (const dutyPeriod of upcomingDutyPeriods) {
        // Clear the variables
        let isEarlyStart: boolean = false;
        let isLateFinish: boolean = false;
        let isNightDuty: boolean = false;
        let isNightStart: boolean = false;

        // Clear the values
        dutyPeriod.isDisruptiveSchedule = false;
        dutyPeriod.isEarlyStart = false;
        dutyPeriod.isLateFinish = false;
        dutyPeriod.isNightDuty = false;
        dutyPeriod.isNightStart = false;

        dutyPeriod.isEzyEarlyStart = false;
        dutyPeriod.isEzyLateFinish = false;
        dutyPeriod.isEzyNightFinish = false;
        dutyPeriod.isEzyDisruptiveDuty = false;
        dutyPeriod.isMorningDuty = false;
        dutyPeriod.isEveningDuty = false;
        dutyPeriod.isDualDuty = false;
        dutyPeriod.isNeutralDuty = false;


        const startTimeHHMM = dutyPeriod.reportTime.substring(11, 16);
        const dutyStartTimeMins = convertTimeToMinutes(startTimeHHMM);
        const endTimeHHMM = dutyPeriod.debriefTime.substring(11, 16);
        const dutyEndTimeMins = convertTimeToMinutes(endTimeHHMM);
        const sameDay = isSameDay(new Date(dutyPeriod.reportTime), new Date(dutyPeriod.debriefTime))

        //EARLY START 7.1.2.7
        // If start time is greater than or equal to 5 and start time is less than 6:59 then isEarlyStart is true
        if (dutyStartTimeMins >= earlyStartBeginMins && dutyStartTimeMins <= earlyStartEndMins) {
            isEarlyStart = true;
            dutyPeriod.isEarlyStart = true;
            dutyPeriod.dutyType = 'Early Start';
        }

        //EASYJET EARLY START 7.4.2.4
        // If start time is greater than or equal to 02:00 and start time is less than or equal 06:59 
        if (dutyStartTimeMins >= ezyEarlyStartBeginMins && dutyStartTimeMins <= ezyEarlyStartEndMins) {
            dutyPeriod.isEzyEarlyStart = true;
            dutyPeriod.dutyType = 'Easy Early Start';
        }

        //LATE FINISH 7.1.2.7
        // If end time is greater than or equal to 11 and less than or equal to 1:59 then isLateFinish is true
        if (dutyEndTimeMins >= lateFinishBeginMins || dutyEndTimeMins <= lateFinishEndMins) {
            isLateFinish = true;
            dutyPeriod.isLateFinish = true;
            dutyPeriod.dutyType = 'Late Finish';
        }

        //EASYJET LATE FINISH 7.4.2.5
        // If end time is greater than and equal to 01:00 and less than or equal to 1:59 
        if (dutyEndTimeMins >= ezyLateFinishBeginMins && dutyEndTimeMins <= ezyLateFinishEndMins) {
            dutyPeriod.isEzyLateFinish = true;
            dutyPeriod.dutyType = 'Easy Late Finish';
        }

        //EASYJET NIGHT FINISH 7.4.2.7
        // If end time is greater than or equal to 02:00 and less than or equal to 04:59 
        if (dutyEndTimeMins >= ezyNightFinishBeginMins && dutyEndTimeMins <= ezyNightFinishEndMins) {
            dutyPeriod.isEzyNightFinish = true;
            dutyPeriod.dutyType = 'Easy Night Finish';
        }

        //NIGHTSTART
        // NightStart will not be false if EarlyStart is true
        if (!isEarlyStart) {
            if (dutyStartTimeMins >= nightDutyBeginMins && dutyStartTimeMins <= nightDutyEndMins) {
                isNightStart = true;
                dutyPeriod.isNightStart = true;
                dutyPeriod.dutyType = 'Night Start';
            }
        }

        //NIGHT DUTY 7.1.2.8
        // If start time is greater than or equal to 2 and start time is between 4:59 then isNightStart is true// NIGHTDUTY
        // if duty period encroaches on any period between 2 and 4:59 
        // duty start time is in night duty range
        if (isNightStart) {
            isNightDuty = true;
            dutyPeriod.isNightDuty = true;
            dutyPeriod.dutyType = 'Night Duty';
        } else {
            // duty end time is in night duty range
            if (dutyEndTimeMins >= nightDutyBeginMins && dutyEndTimeMins <= nightDutyEndMins) {
                isNightDuty = true;
                dutyPeriod.isNightDuty = true;
                dutyPeriod.dutyType = 'Night Duty';
            }
            // duty start time is before the night duty range and duty end time is after the night duty range
            else if (dutyStartTimeMins < nightDutyBeginMins && dutyEndTimeMins > nightDutyEndMins) {
                isNightDuty = true;
                dutyPeriod.isNightDuty = true;
                dutyPeriod.dutyType = 'Night Duty';
            }
        }

        //EASYJET DISRUPTIVE DUTY 7.4.2.6
        // If duty period occurs in period between 01:00 and less than or equal to 06:59 
        // if ej disruption is true disruption will also be true so is written out there
        if ((dutyStartTimeMins >= ezyDisruptiveBeginMins && dutyStartTimeMins <= ezyDisruptiveEndMins) ||
            (dutyEndTimeMins >= ezyDisruptiveBeginMins && dutyEndTimeMins <= ezyDisruptiveEndMins)) {
            dutyPeriod.isEzyDisruptiveDuty = true;
        }

        //DISRUPTION 
        // Disruptive duty true if there has been an early start, late finish or night duty e.g. if
        // duty period occurs in period between 23:00 and less than or equal to 06:59. 
        // If disruption is true write to array
        if (isEarlyStart || isLateFinish || isNightDuty) {
            dutyPeriod.isDisruptiveSchedule = true;
            disruptiveDuties.push({
                dutyPeriodID: dutyPeriod.dutyPeriodID, isEzyDisruptiveDuty: dutyPeriod.isEzyDisruptiveDuty, isEarlyStart: isEarlyStart, 
                isLateFinish: isLateFinish, isEzylateFinish: dutyPeriod.isEzyLateFinish, nightStart: isNightStart, nightDuty: isNightDuty
            });
        }

        //MORNING DUTY 7.4.2.8
        // If start time is greater than or equal to 00:00 and less than or equal to 09:29 
        // and finish time ess than or equal to 17:59
        if ((sameDay) && dutyStartTimeMins >= MornDutyBeginMins && dutyStartTimeMins <= MornDutyStartEndMins
            && dutyEndTimeMins <= MornDutyEndMins) {
            dutyPeriod.isMorningDuty = true;
            dutyPeriod.dutyType = 'Morning Duty';
        }

        //EVENING DUTY 7.4.2.9
        // If start time is greater than or equal to 09:30 and finish time at or after 17:59
        if ((dutyStartTimeMins >= eveDutyBeginMins && (sameDay) && dutyEndTimeMins >= eveDutyEndMins)
            || (dutyStartTimeMins >= eveDutyBeginMins && (!sameDay))) {
            dutyPeriod.isEveningDuty = true;
            dutyPeriod.dutyType = 'Evening Duty';
        }

        //DUAL DUTY 7.4.2.10
        // If start time is greater than or equal to 00:00 and less than or equal to 09:29 
        // and finish time after or equal to 18:00
        if ((dutyStartTimeMins >= dualDutyBeginMins && dutyStartTimeMins <= dualDutyStartEndMins
            && (sameDay) && dutyEndTimeMins >= dualDutyEndMins)
            || (dutyStartTimeMins >= dualDutyBeginMins && dutyStartTimeMins <= dualDutyStartEndMins
                && (!sameDay))) {
            dutyPeriod.isDualDuty = true;
            dutyPeriod.dutyType = 'Dual Duty';
        }

        //NEUTRAL DUTY 7.4.2.11
        // If start time is greater than or equal to 09:30 and finish time at or before 17:59
        if ((sameDay) && dutyStartTimeMins >= neutralDutyBeginMins && dutyEndTimeMins <= neutralDutyEndMins) {
            dutyPeriod.isNeutralDuty = true;
            dutyPeriod.dutyType = 'Neutral Duty';
        }
    }
    return disruptiveDuties;
}