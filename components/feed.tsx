// import {
// 	DoubleArrowDownIcon,
// 	// BookmarkIcon,
// 	// CheckIcon,
// 	// EnterIcon,
// 	// ExitIcon,
// } from "@radix-ui/react-icons";
import {
	ArrowDownIcon,
	// ArrowLeftRightIcon,
	// LogInIcon,
	// LogOutIcon,
	// PlaneIcon,
	// PlaneLandingIcon,
	// PlaneTakeoffIcon,
} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "./ui";

// TODO: Local/Zulu toggle
// TODO: Report instructions with locations
// TODO: Include the date somewhere

// const timeline = [
//   {
//     id: 1,
//     type: "main",
//     preTitle: "09:00",
//     title: "Report",
//     datetime: "2020-09-20",
//     icon: LogInIcon,
//     iconBackground: "bg-sky-400",
//   },
//   {
//     id: 2.05,
//     type: "main",
//     preTitle: "10:00 - 12:05",
//     title: "London Gatwick (LGW) to Faro (FAO)",
//     subtitle: "U2 1234 | 2 hrs 5 mins | G-EZTL (A320)",
//     date: "",
//     datetime: "2020-09-22",
//     icon: PlaneIcon,
//     expandable: false,
//     iconBackground: "bg-green-500",
//   },
//   {
//     id: 2.06,
//     type: "between",
//     titlePrefix: "Turnaround - 35 mins",
//     title: "",
//     date: "",
//     datetime: "2020-09-22",
//     icon: ArrowLeftRightIcon,
//     iconBackground: "bg-sky-500",
//   },
//   {
//     id: 2.07,
//     type: "main",
//     preTitle: "12:40 - 14:40",
//     title: "Faro (FAO) to London Gatwick (LGW)",
//     subtitle: "U2 1235 | 2 hrs | G-EZTL (A320)",
//     date: "",
//     datetime: "2020-09-22",
//     icon: PlaneIcon,
//     expandable: false,
//     iconBackground: "bg-green-500",
//   },
//   {
//     id: 6,
//     type: "main",
//     preTitle: "18:00",
//     title: "Off Duty",
//     date: "",
//     datetime: "2020-09-20",
//     icon: LogOutIcon,
//     iconBackground: "bg-sky-400",
//   },
// ];

interface Timeline {
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
}

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

// TODO: Map should have info pings (e.g LGW) for locations

export function Feed({ timeline }: { timeline: Timeline[] }) {
	return (
		<View className="flow-root">
			<View role="list" className="-mb-8">
				{timeline.map((event, eventIdx) => {
					if (event.type === "main") {
						return (
							<View className="flex flex-row flex-wrap mb-2">
								<Text className="mr-2 text-m text-foreground font-bold">
									{event.preTitle}
								</Text>
								<Text className="text-m text-foreground">{event.title}</Text>
								{/* <Text className="text-m text-foreground font-extrabold" >{event.subtitle}</Text> */}
							</View>
						);
					}
					// else if (event.type === "between") {
					// 	return (
					// 		<View key={event.id}>
					// 			<View className="relative pb-8">
					// 				{eventIdx !== timeline.length - 1 ? (
					// 					<View
					// 						className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
					// 						// aria-hidden="true"
					// 					/>
					// 				) : null}
					// 				<View className="relative flex space-x-3">
					// 					<View>
					// 						<View
					// 							className={classNames(
					// 								// event.iconBackground,
					// 								"bg-white",
					// 								"h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white",
					// 							)}
					// 						>
					// 							{/* @ts-ignore */}
					// 							<event.icon
					// 								className={classNames(
					// 									event.icon.displayName === "Plane"
					// 										? "rotate-135"
					// 										: "",
					// 									"h-5 w-5 text-gray-400 ",
					// 								)}
					// 								aria-hidden="true"
					// 							/>
					// 						</View>
					// 					</View>
					// 					<View className="flex min-w-0 flex-1 justify-between space-x-4 pt-1">
					// 						<View>
					// 							<View className="text-md text-gray-500 inline">
					// 								{event.titlePrefix}{" "}
					// 								<Text className="font-medium text-gray-900">
					// 									{event.title}
					// 								</Text>
					// 							</View>
					// 						</View>
					// 						<View className="whitespace-nowrap text-right text-md text-gray-500">
					// 							{/* {event.expandable ? (
					// 								<Button>
					// 									<DoubleArrowDownIcon className="h-4 w-4" />
					// 								</Button>
					// 							) : (
					// 								<></>
					// 								// <time dateTime={event.datetime}>{event.date}</time>
					// 							)} */}
					// 						</View>
					// 					</View>
					// 				</View>
					// 			</View>
					// 		</View>
					// 	);
					// }
				})}
			</View>
		</View>
	);
}
