export interface duty {
    dutyPeriodID: number;
    dutyID: number;
    dutyType: string;
    origin: string;
    destination: string;
    reportTime?: string;
    startTime: string;
    endTime: string;
    debriefingTime?: string;
    duration?: string;
    isDisruptiveSchedule?: boolean;
}[];

export interface dutyPeriod {
    dutyBlockID: number;
    dutyPeriodID: number;
    sectors: number;
    startTime: string;
    reportTime: string;
    endTime: string;
    debriefTime: string;
    dutyPeriodHHMM: string;
    flightDutyPeriodHHMM: string;
    maxFDPHHMM?: string;
    earliestDPStartTime: string;
    earliestNextDPStartTime: string;
    isEligibleForHotel?: boolean;
    isMaxFDPExceeded?:boolean;
    isRestShort?: boolean;
    dutyIDs: number[];
    dutyType?: string;
    isDisruptiveSchedule?: boolean;
    isEarlyStart?: boolean;
    isLateFinish?: boolean;
    isNightDuty?: boolean;
    isNightStart?: boolean;
    isEzyDisruptiveDuty?: boolean;
    isEzyEarlyStart?: boolean;
    isEzyLateFinish?: boolean;
    isEzyNightFinish?: boolean;
    isMorningDuty?: boolean;
    isEveningDuty?: boolean;
    isDualDuty?: boolean;
    isNeutralDuty?: boolean;
}[];

export interface dutyBlock {
    dutyBlockID: number;
    dutyPeriodCount: number;
    reportTime: string;
    debriefTime: string;
    durationHHMM: string;
    dutyPeriodIDs: number[];
}[];

export interface disruptiveDuties {
    dutyPeriodID: number;
    isEzyDisruptiveDuty?: boolean;
    isEarlyStart?: boolean;
    isLateFinish?: boolean;
    isEzyLateFinish?: boolean;
    isNightDuty?: boolean;
    isNightStart?: boolean;

}[];

export interface restPeriodShort {
    dutyPeriodID: number;
    earliestDPStartTime: string;
    actualDPStartTime: string;
}[];

export interface maxFDPExceeded {
    dutyPeriodID: number;
    sectors: number;
    reportTimeHHMM: string;
    flightDutyPeriodHHMM: string;
    maxFDPHHMM: string;
}[];

export interface dailyMinutes {
    timeZone: string; //local/UTC
    dayDate: string;  //'2023-01-31'
    dutyMinutes: number;
    flightMinutes: number;
    dutyPeriodID: number;
}[];

export interface aggregatedDailyMinutes {
    timeZone: string;
    dayDate: string;
    dutyMinutes: number;
    flightMinutes: number;
    dutyPeriodIDs: number[];
};

export interface cumulativeHoursExceeded {
    scheme: 'FTL' | 'FRM';
    dutyType: string; //"duty" ot "flight"
    rule: string //e.g. "seven day total", "twenty eight day total" etc
    startDate: string;
    endDate: string;
    dutyMinutes?: number;
    flightMinutes?: number;
};

export interface currentFlightAndDutyTotals {
    currentDate: string;
    startDate: string;
    period: string;
    dutyMinutes?: number;
    flightMinutes?: number;
};
export interface cumulativeFlightAndDutyHours {
    givenDate: string;
    startDate: string;
    period: string;
    dutyMinutes?: number;
    flightMinutes?: number;
};
export interface cumulative7DayHours {
    period: '7 Day';
    startDate: string;
    endDate: string;
    dutyMinutes?: number;
    flightMinutes?: number;
};
export interface cumulative14DayHours {
    period: '14 Day';
    startDate: string;
    endDate: string;
    dutyMinutes?: number;
    flightMinutes?: number;
};
export interface cumulative28DayHours {
    period: '28 Day';
    startDate: string;
    endDate: string;
    dutyMinutes?: number;
    flightMinutes?: number;
};
export interface cumulative12WeekHours {
    period: '12 Week';
    startDate: string;
    endDate: string;
    dutyMinutes?: number;
    flightMinutes?: number;
};
export interface cumulative6MonthHours {
    period: '6 Month';
    startDate: string;
    endDate: string;
    dutyMinutes?: number;
    flightMinutes?: number;
};
export interface cumulative9MonthHours {
    period: '9 Month';
    startDate: string;
    endDate: string;
    dutyMinutes?: number;
    flightMinutes?: number;
};
export interface cumulative12MonthHours {
    period: '12 Month';
    startDate: string;
    endDate: string;
    dutyMinutes?: number;
    flightMinutes?: number;
};
export interface cumulative1YearHours {
    period: '1 Year';
    startDate: string;
    endDate: string;
    dutyMinutes?: number;
    flightMinutes?: number;
};