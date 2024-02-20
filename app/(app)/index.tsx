import { addDays } from "date-fns";
import * as Calendar from "expo-calendar";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";

import { Feed } from "@/components/feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { calendarToEvents } from "@/services/calendar";
import {
	addDutiesToDutyPeriods,
	calculateDutyPeriod,
	formatDutyPeriods,
} from "@/services/duty-periods";

type TEvent = {
	startDate: Date;
	endDate: Date;
};

export default function TabOneScreen() {
	const [events, setEvents] = useState<TEvent[]>([]);

	useEffect(() => {
		(async () => {
			const { status } = await Calendar.requestCalendarPermissionsAsync();
			if (status === "granted") {
				const calendars = await Calendar.getCalendarsAsync(
					Calendar.EntityTypes.EVENT,
				);
				console.log(calendars);
				const calendarId = "81715A91-086D-489F-B587-42B940CBD7D8";
				const mumsCalendarId = "B94BAD5D-87A3-4369-B06E-2AC5EB316BDE";
				const iosSimCalendarId = "C7856478-1AA3-4D6A-9563-A375108565A5";

				// const allCalendarIds = calendars.map((cal) => cal.id);

				// console.log(allCalendarIds);

				const from = new Date();
				const to = addDays(new Date(), 20);
				const calEvents = await Calendar.getEventsAsync(
					[calendarId, mumsCalendarId, iosSimCalendarId],
					// allCalendarIds,
					from,
					to,
				);

				console.log(calEvents);

				let parsedEvents = calendarToEvents(calEvents);

				parsedEvents = parsedEvents.filter(function (element) {
					return element !== undefined;
				});

				// console.log(parsedEvents);

				// Calculate duty periods from duties
				// @ts-ignore
				const dutyPeriods = calculateDutyPeriod(parsedEvents);

				// console.log(dutyPeriods);

				// Take duties, amalgamate with duty periods
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const dutyPeriodsWithDuties = addDutiesToDutyPeriods(
					// @ts-ignore
					dutyPeriods,
					// @ts-ignore
					parsedEvents,
				);

				console.log(dutyPeriodsWithDuties);

				// Format this data into the correct format to be displayed
				const formattedDutyPeriods = formatDutyPeriods(dutyPeriodsWithDuties);

				// console.log(formattedDutyPeriods);

				// @ts-ignore
				setEvents(formattedDutyPeriods);
			}
		})();
	}, []);

	return (
		<View className="flex-1 bg-background">
			<ScrollView className="p-4 gap-y-4">
				<Text className="mt-2 text-3xl text-foreground font-extrabold tracking-tight lg:text-5xl">
					Welcome back, Kieran
				</Text>
				<Text className="mb-4 text-md text-muted-foreground">
					Your roster looks good for this period - take a look below.
				</Text>
				{events.map((dutyPeriod, index) => (
					<>
						<Card className="col-span-4 overflow-hidden mb-4">
							<View className="flex flex-row">
								<View className="grow min-w-72 w-full">
									<CardHeader>
										<CardTitle>{dutyPeriod.dateString}</CardTitle>
									</CardHeader>
									<CardContent
										className=""
										key={`${dutyPeriod.dutyPeriodID.toString()}-feed`}
									>
										<Feed timeline={dutyPeriod.timeline} />
									</CardContent>
								</View>
								{/* <View className="min-h-full min-w-72 w-full ml-2">
						<Map />
					  </View> */}
							</View>
						</Card>
						{/* <Card className="md:col-span-3 col-span-4 overflow-hidden">
						<View className="flex flex-row">
							<View className="grow min-w-72 w-full">
								<CardHeader>
									<CardTitle>About This Duty</CardTitle>
								</CardHeader>
								<CardContent key={`${dutyPeriod.dutyPeriodID.toString()}-info`}>
								</CardContent>
							</View>
						</View>
					</Card> */}
					</>
				))}
			</ScrollView>
		</View>
	);
}
