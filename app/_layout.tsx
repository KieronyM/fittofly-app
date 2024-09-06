import "../global.css";

// import { Image } from "expo-image";
import { Stack, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect, useCallback, useRef } from "react";
import { StyleSheet, Image, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Bell } from "@/components/Icons";
import { SupabaseProvider } from "@/context/SupabaseProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { CloudDownload } from "lucide-react-native";

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

	// ref
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	// callbacks
	const handleSheetChanges = useCallback((index: number) => {
		console.log("handleSheetChanges", index);
	}, []);

	const handlePresentPress = () => bottomSheetModalRef.current?.present();

	return (
		<SupabaseProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<BottomSheetModalProvider>
					<SafeAreaProvider>
						<StatusBar style="light" />
						<Stack>
							<Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
										<CloudDownload
											// fill="white"
											onPress={handlePresentPress}
											color="white"
											strokeWidth={2.5}
											size="25"
										/>
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
										<Bell
											// fill="white"
											color="white"
											strokeWidth={2.5}
											size="25"
										/>
									),
								}}
							/>
						</Stack>
						<BottomSheetModal
							snapPoints={["80%"]}
							ref={bottomSheetModalRef}
							onChange={handleSheetChanges}
							// // add bottom inset to elevate the sheet
							// bottomInset={46}
							// // set `detached` to true
							// detached={true}
							enablePanDownToClose
							// style={styles.sheetContainer}
							style={{
								shadowColor: "#000",
								shadowOffset: {
									width: 0,
									height: 10,
								},
								shadowOpacity: 0.51,
								shadowRadius: 13.16,

								elevation: 20,
							}}
						>
							{/* <BottomSheetView style={styles.contentContainer}> */}
							<Text>Awesome hello🎉</Text>
							{/* </BottomSheetView> */}
						</BottomSheetModal>
					</SafeAreaProvider>
				</BottomSheetModalProvider>
			</GestureHandlerRootView>
		</SupabaseProvider>
	);
}
