import { LucideIcon } from "lucide-react-native";

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
