import HorizontalDatepicker from "@awrminkhodaei/react-native-horizontal-datepicker";
import { addDays } from "date-fns";
import * as Calendar from "expo-calendar";
import { LinearGradient } from "expo-linear-gradient";
import { LucideIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Image } from "react-native-svg";

import A320 from "@/components/creatives/a320";
import CloudsImage from "@/components/creatives/clouds";
import EZYA320 from "@/components/creatives/ezy-a320";
import Plane from "@/components/creatives/plane";
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
import { processRoster } from "@/services/process-roster";
import { duty } from "@/types";

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
	}[];
};

export default function TabOneScreen() {
	const [events, setEvents] = useState<TEvent[]>([]);
	const [duties, setDuties] = useState<
		{
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
		}[]
	>([]);

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
	useEffect(() => {
		(async () => {
			const upcomingDuties = await processRoster();
			setDuties(upcomingDuties);
		})();
	}, []);

	// ------------------------------------------------------------

	const [multiple, setMultiple] = React.useState<string[]>(["item-1"]);

	// https://gradient.page/css/ui-gradients
	const gradients = {
		sunrise: [
			"#3f51b1",
			"#5a55ae",
			"#7b5fac",
			"#8f6aae",
			"#a86aa4",
			"#cc6b8e",
			"#f18271",
			"#f3a469",
			"#f7c978",
		],
		day: ["#2f80ed", "#56ccf2"],
		day2: ["#495aff", "#0acffe"],
		sunset: ["#0B486B", "#F56217"],
		night: ["#000428", "#004e92"],
	};

	return (
		<View className="flex-1 bg-background">
			<ScrollView className="gap-y-4">
				{/* <View
					style={{ width: "100%", height: 350, backgroundColor: "#0EA5E9" }}
				> */}
				<LinearGradient
					// Background Linear Gradient
					colors={gradients.sunrise}
					// className="flex mt-[150px]"
					style={{ width: "100%" }}
					// style={styles.background}
				>
					<View className="mt-[120px]" style={{ flexDirection: "row" }}>
						<View style={{ flex: 1 }}>
							<Text
								style={{ fontFamily: "PlayfairDisplay_800ExtraBold" }}
								className="ml-5 text-5xl text-white font-extrabold tracking-tight lg:text-5xl"
							>
								{/* Can also be nice to know or need to know with error below */}
								Good{"\n"}
								to go.
							</Text>
							<Text className="mt-3 text-lg text-white font-semibold ml-5">
								Take a look at your roster below.
							</Text>
						</View>
						<View className="mr-5 -mb-[30px]" style={{ flex: 1 }}>
							{/* <Plane /> */}
							<EZYA320 />
						</View>
					</View>
					<View className="-mb-[54px] -mt-[70px]">
						<CloudsImage />
					</View>
				</LinearGradient>
				{/* </View> */}

				<View className="pt-2">
					{/* <Text
						// style={{ fontFamily: "PlayfairDisplay_800ExtraBold" }}
						className="mb-4 text-2xl font-bold text-foreground"
					>
						Today
					</Text> */}
					<HorizontalDatepicker
						mode="gregorian"
						startDate={new Date("2024-02-22")}
						endDate={new Date("2024-03-31")}
						initialSelectedDate={new Date("2024-02-22")}
						onSelectedDateChange={(date) => console.log(date)}
						selectedItemWidth={170}
						unselectedItemWidth={38}
						itemHeight={38}
						itemRadius={10}
						// selectedItemTextStyle={styles.selectedItemTextStyle}
						// unselectedItemTextStyle={styles.selectedItemTextStyle}
						selectedItemBackgroundColor="#222831"
						unselectedItemBackgroundColor="#ececec"
						flatListContainerStyle={{ backgroundColor: "white" }}
						// flatListContainerStyle={styles.flatListContainerStyle}
					/>
					{/* <Text>
						Roster goes here
					</Text> */}
				</View>

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
