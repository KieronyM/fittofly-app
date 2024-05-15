import "../global.css";

// import { Image } from "expo-image";
import { Stack, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect, useCallback } from "react";
import { StyleSheet, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Bell } from "@/components/Icons";
import { SupabaseProvider } from "@/context/SupabaseProvider";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	initialRouteName: "(auth)",
};

SplashScreen.preventAutoHideAsync();

const styles = StyleSheet.create({
	image: {
		height: 30,
		width: 130,
		marginRight: 13,
	},
});

export default function RootLayout() {
	useEffect(() => {
		// HACK: Hide splash screen after 1 second to hide initial routing animation.
		setTimeout(() => {
			SplashScreen.hideAsync();
		}, 1000);
	}, []);

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const { colorScheme } = useColorScheme();

	return (
		<SupabaseProvider>
			<SafeAreaProvider>
				<StatusBar style="light" />
				<Stack>
					<Stack.Screen name="(auth)" options={{headerShown: false}}/>
					<Stack.Screen
						name="(app)"
						options={{
							headerShadowVisible: false,
							headerTransparent: true,
							headerStyle: {
								// TODO: This should be solid then fade to transparency
								// backgroundColor: "#0EA5E9",
								// colorScheme === "dark" ? "hsl(240, 10%, 3.9%)" : "#0EA5E9",
							},
							headerLeft: () => (
								<Bell fill="white" color="white" strokeWidth={2} size="20" />
							),
							headerTitle: () => (
								<Image
									style={styles.image}
									source={
										// colorScheme === "dark"
										// 	?
										require("../assets/logo/fittofly-ultra-dark-3.png")
										// : require("../assets/logo/fittofly-test.png")
									}
								/>
							),
							headerRight: () => (
								<Image
									style={{ height: 32, width: 32, borderRadius: 100 }}
									source={require("../assets/placeholder/profile-pic.jpeg")}
								/>
							),
						}}
					/>
				</Stack>
			</SafeAreaProvider>
		</SupabaseProvider>
	);
}
