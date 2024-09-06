import HorizontalDatepicker from "@awrminkhodaei/react-native-horizontal-datepicker";
import { LinearGradient } from "expo-linear-gradient";
import {
	ArrowLeftRight,
	LogInIcon,
	LogOutIcon,
	PlaneIcon,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import CloudsImage from "@/components/creatives/clouds";
import EZYA320 from "@/components/creatives/ezy-a320";
import { cn } from "@/lib/utils";

export default function TabOneScreen() {
	const timeline = [
		{
			id: 1,
			type: "main",
			icon: LogInIcon,
			iconBackground: "bg-sky-400",
			aboveTitle: "09:00",
			content: "Report",
			belowTitle: "",
		},
		{
			id: 2,
			type: "main",
			content: "London Gatwick (LGW) to Faro (FAO)",
			aboveTitle: "10:00 - 12:05",
			belowTitle: "U2 1234 | 2 hrs 5 mins | G-EZTL (A320)",
			icon: PlaneIcon,
			iconBackground: "bg-green-500",
		},
		{
			id: 2.1,
			type: "between",
			content: "Turnaround - 35 mins",
			aboveTitle: "",
			belowTitle: "",
			icon: ArrowLeftRight,
			iconBackground: "bg-white",
		},
		{
			id: 3,
			type: "main",
			content: "Faro (FAO) to London Gatwick (LGW)",
			aboveTitle: "12:35 - 14:00",
			belowTitle: "U2 1235 | 2 hrs 25 mins | G-EZTL (A320)",
			icon: PlaneIcon,
			iconBackground: "bg-green-500",
		},
		{
			id: 7,
			type: "between",
			content: "Turnaround - 35 mins",
			aboveTitle: "",
			belowTitle: "",
			icon: ArrowLeftRight,
			iconBackground: "bg-white",
		},
		{
			id: 6,
			type: "main",
			content: "Faro (FAO) to London Gatwick (LGW)",
			aboveTitle: "12:35 - 14:00",
			belowTitle: "U2 1235 | 2 hrs 25 mins | G-EZTL (A320)",
			icon: PlaneIcon,
			iconBackground: "bg-green-500",
		},
		{
			id: 5,
			type: "main",
			content: "Off Duty",
			aboveTitle: "14:30",
			belowTitle: "",
			icon: LogOutIcon,
			iconBackground: "bg-sky-500",
		},
	];

	// ------------------------------------------------------------

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

	// TODO: Replace top with map
	// TODO: Move this header to the notification page
	
	return (
		<View className="flex-1 bg-background">
			<ScrollView className="gap-y-4" alwaysBounceVertical={false}>
				{/* <View
					style={{ width: "100%", height: 350, backgroundColor: "#0EA5E9" }}
				> */}
				<LinearGradient
					// Background Linear Gradient
					colors={gradients.day}
					// className="flex mt-[150px]"
					style={{ width: "100%", height: 370 }}
					// style={styles.background}
				>
					<View style={{ flexDirection: "row", marginTop: 126 }}>
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
						<View className="mr-5" style={{ flex: 1, marginBottom: -40 }}>
							{/* <Plane /> */}
							<EZYA320 />
						</View>
					</View>
					<View style={{ marginTop: -70, marginBottom: -54 }}>
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
						startDate={new Date("2024-03-13")}
						endDate={new Date("2024-03-31")}
						initialSelectedDate={new Date("2024-03-13")}
						onSelectedDateChange={(date) => console.log(date)}
						selectedItemWidth={170}
						unselectedItemWidth={38}
						itemHeight={38}
						itemRadius={10}
						// selectedItemTextStyle={styles.selectedItemTextStyle}
						// unselectedItemTextStyle={styles.selectedItemTextStyle}
						selectedItemBackgroundColor="#0EA5E9"
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
										<View
											style={{ left: 17 }}
											className="absolute top-8 -ml-px h-full w-1 bg-gray-200"
										/>
									) : null}
									<View className="relative flex space-x-3">
										<View>
											<View
												className={cn(
													event.iconBackground,
													"h-12 w-12 rounded-full flex items-center justify-center ring-8 ring-white",
												)}
											>
												<event.icon
													size={event.type === "main" ? 24 : 20}
													color={event.type === "main" ? "white" : "#6b7280"}
												/>
											</View>
										</View>
										<View
											style={{ paddingLeft: 50, marginTop: -38 }}
											className="flex min-w-0 flex-1 justify-between space-x-4"
										>
											<View>
												<Text className="text-lg text-gray-500">
													{event.aboveTitle}
												</Text>
												<Text
													style={{ marginTop: -6 }}
													className={
														event.type === "main"
															? "text-lg font-medium text-gray-900"
															: "text-lg font-medium text-gray-500"
													}
												>
													{event.content}
												</Text>
												{event.belowTitle.length > 1 && (
													<Text className="text-lg text-gray-600">
														{event.belowTitle}
													</Text>
												)}
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
