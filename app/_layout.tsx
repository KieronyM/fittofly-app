import "../global.css";

// import { Image } from "expo-image";
import { Stack, SplashScreen } from "expo-router";
import { useFonts } from 'expo-font';
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
	const [fontsLoaded, fontError] = useFonts({
		'RecklessNeue-Heavy': require('../assets/fonts/RecklessNeue/RecklessNeue-Heavy.ttf'),
	  });

	//   const onLayoutRootView = useCallback(async () => {
	// 	if (fontsLoaded || fontError) {
	// 	  await SplashScreen.hideAsync();
	// 	}
	//   }, [fontsLoaded, fontError]);
	
	  if (!fontsLoaded && !fontError) {
		return null;
	  }

	useEffect(() => {
		// HACK: Hide splash screen after 1 second to hide initial routing animation.
		setTimeout(() => {
			if (fontsLoaded || fontError) {
				SplashScreen.hideAsync();
			  }
			// SplashScreen.hideAsync();
		}, 1000);
	}, [fontsLoaded, fontError]);

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
										: "#0EA5E9",
							},
							headerLeft: () => (
								<Bell fill={'white'} color={'#1E293B'} strokeWidth={2} size={'20'}/>
							),
							headerTitle: () => (
								<Image
									style={styles.image}
									source={
										// colorScheme === "dark"
										// 	? 
											require("../assets/logo/fittofly-dark.png")
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
