import "../global.css";

// import { Image } from "expo-image";
import { Stack, SplashScreen } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { StyleSheet, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
				<Stack>
					<Stack.Screen name="(auth)" />
					<Stack.Screen
						name="(app)"
						options={{
							headerStyle: {
								backgroundColor:
									colorScheme === "dark"
										? "hsl(240, 10%, 3.9%)"
										: "hsl(0, 0%, 100%)",
							},
							headerLeft: () => (
								<Image
									style={styles.image}
									source={
										colorScheme === "dark"
											? require("../assets/logo/fittofly-dark.png")
											: require("../assets/logo/fittofly-test.png")
									}
								/>
							),
							headerTitle: () => "",
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
