import { Tabs } from "expo-router";
import {
	CalendarFold,
	MessageCircleQuestion,
	Settings,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React from "react";

export default function AppLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					borderTopColor:
						colorScheme === "dark" ? "#424144" : "hsl(240, 10%, 3.9%)",
					backgroundColor:
						colorScheme === "dark" ? "hsl(240, 10%, 3.9%)" : "hsl(0, 0%, 100%)",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Dashboard",
					tabBarIcon({ color, size }) {
						return <CalendarFold color={color} size={size} />;
					},
				}}
			/>
			<Tabs.Screen
				name="one"
				options={{
					title: "FAQs",
					tabBarIcon({ color, size }) {
						return <MessageCircleQuestion color={color} size={size} />;
					},
				}}
			/>
			<Tabs.Screen
				name="two"
				options={{
					title: "Settings",
					tabBarIcon({ color, size }) {
						return <Settings color={color} size={size} />;
					},
				}}
			/>
		</Tabs>
	);
}
