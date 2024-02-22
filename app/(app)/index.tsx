import { addDays } from "date-fns";
import * as Calendar from "expo-calendar";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Image } from 'react-native-svg';

import { Feed } from "@/components/feed";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { calendarToEvents } from "@/services/calendar";
import {
	addDutiesToDutyPeriods,
	calculateDutyPeriod,
	formatDutyPeriods,
} from "@/services/duty-periods";
import { LucideIcon } from "lucide-react-native";
import { processRoster } from "@/services/process-roster";
import { duty } from "@/types";
import CloudsImage from "@/components/creatives/clouds";

type TEvent = {
	startDate: Date;
	endDate: Date;
	dutyPeriodID: number;
	dateString: string;
	timeline: {
		id: number;
		type: string;
		preTitle?: string;
		title: string;
		isFlight?: boolean;
		//  datetime: string;
		icon: LucideIcon;
		iconBackground: string;
		subtitle?: string;
		//  date?: string;
		expandable?: boolean;
		titlePrefix?: string;
	}[]
};

export default function TabOneScreen() {
	const [events, setEvents] = useState<TEvent[]>([]);
	const [duties, setDuties] = useState<{
		dutyPeriodID: number;
		sectors: number;
		startTime: string;
		reportTime: string;
		endTime: string;
		debriefTime: string;
		dutyPeriodHHMM: string;
		flightDutyPeriodHHMM: string;
		earliestDPStartTime: Date;
		earliestNextDPStartTime: Date;
		isEligibleForHotel: boolean;
		dutyIDs: number[];
	}[]>([]);

	// Temporrily removed calendar event import
	// useEffect(() => {
	// 	(async () => {
	// 		const { status } = await Calendar.requestCalendarPermissionsAsync();
	// 		if (status === "granted") {
	// 			const calendars = await Calendar.getCalendarsAsync(
	// 				Calendar.EntityTypes.EVENT,
	// 			);
	// 			// console.log(calendars);
	// 			const calendarId = "81715A91-086D-489F-B587-42B940CBD7D8";
	// 			const mumsCalendarId = "B94BAD5D-87A3-4369-B06E-2AC5EB316BDE";
	// 			const iosSimCalendarId = "C7856478-1AA3-4D6A-9563-A375108565A5";

	// 			// const allCalendarIds = calendars.map((cal) => cal.id);

	// 			// console.log(allCalendarIds);

	// 			const from = new Date();
	// 			const to = addDays(new Date(), 20);
	// 			const calEvents = await Calendar.getEventsAsync(
	// 				[calendarId, mumsCalendarId, iosSimCalendarId],
	// 				// allCalendarIds,
	// 				from,
	// 				to,
	// 			);

	// 			// console.log(calEvents);

	// 			let parsedEvents = calendarToEvents(calEvents);

	// 			parsedEvents = parsedEvents.filter(function (element) {
	// 				return element !== undefined;
	// 			});

	// 			// console.log(parsedEvents);

	// 			// Calculate duty periods from duties
	// 			// @ts-ignore
	// 			const dutyPeriods = calculateDutyPeriod(parsedEvents);

	// 			// console.log(dutyPeriods);

	// 			// Take duties, amalgamate with duty periods
	// 			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// 			// @ts-ignore
	// 			const dutyPeriodsWithDuties = addDutiesToDutyPeriods(
	// 				// @ts-ignore
	// 				dutyPeriods,
	// 				// @ts-ignore
	// 				parsedEvents,
	// 			);

	// 			// console.log(dutyPeriodsWithDuties);

	// 			// Format this data into the correct format to be displayed
	// 			const formattedDutyPeriods = formatDutyPeriods(dutyPeriodsWithDuties);

	// 			// console.log(formattedDutyPeriods);

	// 			// @ts-ignore
	// 			setEvents(formattedDutyPeriods);
	// 		}
	// 	})();
	// }, []);


	// This will need to be passed the correct data eventually
	;

	useEffect(() => {
		(async () => {
			const upcomingDuties = await processRoster();
			setDuties(upcomingDuties);
		})();
	}, []);




	// ------------------------------------------------------------


	const [multiple, setMultiple] = React.useState<string[]>(["item-1"]);

	return (
		<View className="flex-1 bg-background">
			<ScrollView className="gap-y-4">
				<View style={{ aspectRatio: 1, backgroundColor: '#0EA5E9' }}>
					<Text style={{fontFamily: 'RecklessNeue-Heavy'}} className="mt-[40px] ml-10 text-5xl text-white font-extrabold tracking-tight lg:text-5xl">
					Good{"\n"}
					to go!
				</Text>
				<Text  className="text-md text-white font-medium ml-10 mt-[10px] -mb-[100px] ">
					Updated XX/XX/XXXX at 10:15
				</Text>
					<CloudsImage />
				</View>

				{/* <Text className="mb-4 text-md text-muted-foreground">
					Your roster looks good for this period - take a look below.
				</Text> */}
				<Accordion
					type="multiple"
					collapsible
					value={multiple}
					onValueChange={setMultiple}
					className="w-full max-w-sm native:max-w-md"
				>
					{events.map((dutyPeriod, index) => (
						<AccordionItem
							key={`accordion-${dutyPeriod.dutyPeriodID.toString()}`}
							value={`item-${dutyPeriod.dutyPeriodID.toString()}`}
						>
							<AccordionTrigger>
								<Text className="text-foreground text-base native:text-lg font-medium web:group-hover:underline">
									{dutyPeriod.dateString}
								</Text>
							</AccordionTrigger>
							<AccordionContent>
								<Text className="text-foreground text-base native:text-lg">
									<Feed
										key={`feed-${dutyPeriod.dutyPeriodID.toString()}`}
										timeline={dutyPeriod.timeline}
									/>
								</Text>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
				{/* {duties.map((duty, i) => <Text key={i}>{JSON.stringify(duty)}</Text>)} */}
			</ScrollView>
		</View>
	);
}
