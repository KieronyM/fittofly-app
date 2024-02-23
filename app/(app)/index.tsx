import HorizontalDatepicker from "@awrminkhodaei/react-native-horizontal-datepicker";
import { LinearGradient } from "expo-linear-gradient";
import {
	CheckIcon,
	HandHeart,
	HandHeartIcon,
	LucideIcon,
	User,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import CloudsImage from "@/components/creatives/clouds";
import EZYA320 from "@/components/creatives/ezy-a320";
import { cn } from "@/lib/utils";
import { processRoster } from "@/services/process-roster";

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

	const timeline = [
		{
			id: 1,
			content: "Applied to",
			target: "Front End Developer",
			href: "#",
			date: "Sep 20",
			datetime: "2020-09-20",
			icon: User,
			iconBackground: "bg-gray-400",
		},
		{
			id: 2,
			content: "Advanced to phone screening by",
			target: "Bethany Blake",
			href: "#",
			date: "Sep 22",
			datetime: "2020-09-22",
			icon: HandHeart,
			iconBackground: "bg-blue-500",
		},
		{
			id: 3,
			content: "Completed phone screening with",
			target: "Martha Gardner",
			href: "#",
			date: "Sep 28",
			datetime: "2020-09-28",
			icon: CheckIcon,
			iconBackground: "bg-green-500",
		},
		{
			id: 4,
			content: "Advanced to interview by",
			target: "Bethany Blake",
			href: "#",
			date: "Sep 30",
			datetime: "2020-09-30",
			icon: HandHeartIcon,
			iconBackground: "bg-blue-500",
		},
		{
			id: 5,
			content: "Completed interview with",
			target: "Katherine Snyder",
			href: "#",
			date: "Oct 4",
			datetime: "2020-10-04",
			icon: CheckIcon,
			iconBackground: "bg-green-500",
		},
	];

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
					style={{ width: "100%", height: 370 }}
					// style={styles.background}
				>
					<View className="mt-[126px]" style={{ flexDirection: "row" }}>
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
						<View className="mr-5 -mb-[40px]" style={{ flex: 1 }}>
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
				</View>

				<View className="flow-root">
					<View role="list" className="-mb-8 p-4">
						{timeline.map((event, eventIdx) => (
							<View key={event.id}>
								<View className="relative pb-8">
									{eventIdx !== timeline.length - 1 ? (
										<View className="absolute left-[17px] top-8 -ml-px h-full w-1 bg-gray-200" />
									) : null}
									<View className="relative flex space-x-3">
										<View>
											<View
												className={cn(
													event.iconBackground,
													"h-[36px] w-[36px] rounded-full flex items-center justify-center ring-8 ring-white",
												)}
											>
												<event.icon size={24} color="white" />
											</View>
										</View>
										<View className="flex min-w-0 flex-1 justify-between space-x-4 pl-[50px] -mt-[30px]">
											<View>
												<Text className="text-lg text-gray-500">
													{event.content}{" "}
													<Text className="font-medium text-gray-900">
														{event.target}
													</Text>
												</Text>
											</View>
											{/* <Text className="whitespace-nowrap text-right text-md text-gray-500">
												{event.date}
											</Text> */}
										</View>
									</View>
								</View>
							</View>
						))}
					</View>
				</View>

				{/* <Accordion
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
				</Accordion> */}
				{/* {duties.map((duty, i) => <Text key={i}>{JSON.stringify(duty)}</Text>)} */}
			</ScrollView>
		</View>
	);
}
