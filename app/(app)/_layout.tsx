import {
	PlayfairDisplay_800ExtraBold,
	useFonts,
} from "@expo-google-fonts/playfair-display";
import { Tabs } from "expo-router";
import {
	CalendarFold,
	CircleUserRound,
	LineChart,
	MessageCircleQuestion,
	Settings,
	TrendingUp,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React from "react";

export default function AppLayout() {
	const { colorScheme } = useColorScheme();

	const [fontsLoaded, fontError] = useFonts({
		PlayfairDisplay_800ExtraBold,
	});

	if (!fontsLoaded && !fontError) {
		return null;
	}

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
				tabBarShowLabel: false,
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
				name="three"
				options={{
					title: "Stats",
					tabBarIcon({ color, size }) {
						return <LineChart color={color} size={size} />;
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
					title: "Profile",
					tabBarIcon({ color, size }) {
						return <CircleUserRound color={color} size={size} />;
					},
				}}
			/>
		</Tabs>
	);
}
