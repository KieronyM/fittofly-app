import { LucideIcon } from "lucide-react-native";

export interface IRawDuty {
	dutyID: number;
	dutyType: string;
	origin: string;
	destination: string;
	reportTime: string;
	debriefingTime: string;
	startTime: string;
	endTime: string;
}

export interface ICalculatedDutyPeriod {
	dutyPeriodID: number;
	startTime: string;
	endTime: string;
	reportTime: string;
	debriefTime: string;
	sectorCount: number;
	dutyIDs: number[];
	dutyPeriodHHMM: string;
	flightDutyPeriodHHMM: string;
	earliestNextDPStartTime: string;
	earliestDPStartTime: string;
	minimumRestPeriodMinutes: number;
	isEligibleForHotel: boolean;
}

export interface IDisruptiveSchedule {
	disruptiveSchedule: {
		isDisruptiveSchedule: boolean;
		dutyType: string;
		isEarlyStart: boolean;
		isLateFinish: boolean;
		isNightDuty: boolean;
		isNightStart: boolean;
		isEzyEarlyStart: boolean;
		isEzyLateFinish: boolean;
		isEzyNightFinish: boolean;
		isEzyDisruptiveDuty: boolean;
		isMorningDuty: boolean;
		isEveningDuty: boolean;
		isDualDuty: boolean;
		isNeutralDuty: boolean;
	};
}

// Combines the two together
export interface IDutyPeriodsDisruptiveSchedule
	extends ICalculatedDutyPeriod,
		IDisruptiveSchedule {}

export interface duty {
	dutyPeriodID?: number;
	dutyID: number;
	dutyType: string;
	origin: string | undefined;
	destination: string | undefined;
	reportTime?: string | undefined;
	startTime: string | undefined;
	endTime: string | undefined;
	debriefingTime?: string | undefined;
	duration?: string;
	isDisruptiveSchedule?: boolean;
	isEarlyStart?: boolean;
	isLateFinish?: boolean;
	isNightStart?: boolean;
	isNightDuty?: boolean;
}

export interface dutyPeriod {
	dutyPeriodID: number;
	sectors: number;
	startTime: string;
	reportTime: string;
	endTime: string;
	debriefTime: string;
	dutyPeriodHHMM: string;
	flightDutyPeriodHHMM: string;
	dutyIDs: number[];
	duties?: duty[];
}

export interface timeline {
	id: number;
	type: string;
	preTitle?: string;
	title: string;
	startTimeHHMM?: string;
	endTimeHHMM?: string;
	isFlight?: boolean;
	//  datetime: string;
	icon: LucideIcon;
	iconBackground: string;
	subtitle?: string;
	//  date?: string;
	expandable?: boolean;
	titlePrefix?: string;
}

export interface dutyNotifications {
	type: string;
	text: string;
	icon: LucideIcon;
	iconColour: string;
}

export interface formattedDutyPeriod {
	duties?: undefined;
	dutyIDs?: undefined;
	dutyPeriodID: number;
	timeline: timeline[];
	dateString: string;
	dutyNotifications: dutyNotifications[];
}
