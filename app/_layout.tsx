import "../global.css";

// import { Image } from "expo-image";
import { Stack, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
// import { useColorScheme } from "nativewind";
import { useEffect, useCallback, useRef, useState } from "react";
import { StyleSheet, Image, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Bell } from "@/components/Icons";
import { SupabaseProvider } from "@/context/SupabaseProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
	BottomSheetModal,
	BottomSheetModalProvider,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { CloudDownload } from "lucide-react-native";
import WebView from "react-native-webview";
// import jwt from 'jsonwebtoken';

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
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center",
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
	const [eventsData, setEventsData] = useState(null);
	const [eventIds, setEventIds] = useState<string[]>([]);
	const [receivedDutyDetails, setReceivedDutyDetails] = useState<string[]>([]);
	const [webViewOverlay, setWebViewOverlay] = useState(true);

	// ref
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	// callbacks
	const handleSheetChanges = useCallback((index: number) => {
		// console.log("handleSheetChanges", index);
	}, []);

	const handlePresentPress = () => bottomSheetModalRef.current?.present();

	const INJECTED_JAVASCRIPT = `
		(function() {
			let eventsFound = false;

			function findEventsInIframe() {
				if (eventsFound) return;

				const iframe = Array.from(document.getElementsByTagName("iframe")).find(
					(frame) => frame.src && frame.src.includes("/eCrew/Dashboard/HomeIndex"),
				);

				if (iframe && iframe.contentDocument) {
					const scripts = iframe.contentDocument.getElementsByTagName("script");
					for (let i = 0; i < scripts.length; i++) {
						const scriptContent = scripts[i].textContent || scripts[i].innerText;
						const match = scriptContent.match(/var\\s+events\\s*=\\s*(\\[.*?\\]);/s);
						if (match) {
							try {
								const eventsData = JSON.parse(match[1]);

								window.ReactNativeWebView.postMessage(
									JSON.stringify({
										type: "events",
										data: eventsData,
									})
								);
								eventsFound = true;

								// Filter for IDs of type Flight and Default
								const filteredIds = eventsData.filter((event) => event.type === "Flight" || event.type === "Default").map((event) => event.id);

								window.ReactNativeWebView.postMessage(
									JSON.stringify({
										type: "eventIDs",
										data: filteredIds,
									})
								);

								filteredIds.forEach((id) => {
									const header = {
										id,
										calledfrom: 1,
										crewID: "A",
										timesIn: "2",
										Port: "",
										HotelIndex: "",
										HotelInfo: {},
									};

									const token = btoa(JSON.stringify(header));

									EcallUrlAsync(
										"/eCrew/DutyDetails/Index",
										{
											dt: token,
										},
										"get",
										function (response) {
											// Extract DutyDetails from the response
											const dutyDetailsMatch = response.text().match(/var\\s+DutyDetails\\s*=\\s*(\\[.*?\\]);/s);
											if (dutyDetailsMatch) {
												try {
													const dutyDetails = JSON.parse(dutyDetailsMatch[1]);
													window.ReactNativeWebView.postMessage(
														JSON.stringify({
															type: "extractedDutyDetails",
															data: dutyDetails,
															id,
														})
													);
												} catch (e) {
													console.error("Error parsing DutyDetails:", e);
												}
											}

											window.ReactNativeWebView.postMessage(
												JSON.stringify({
													type: "dutyDetails",
													data: response.text(),
													id,
												}),
											);
										},
									);
								});

								return;
							} catch (e) {
								console.error("Error parsing events data:", e);
							}
						}
					}
				}

				// If not found, check again after a short delay
				if (!eventsFound) {
					setTimeout(findEventsInIframe, 500);
				}
			}

			// Start looking for the iframe and events
			findEventsInIframe();

			// Also send location information as before
			window.ReactNativeWebView.postMessage(
				JSON.stringify({
					type: "location",
					data: window.location,
				})
			);
		})()`;

	const handleWebViewMessage = (event: { nativeEvent: { data: string } }) => {
		const data = JSON.parse(event.nativeEvent.data);
		if (data.type === "events") {
			console.log("Events data received:", data.data);
			setEventsData(data.data);
		} else if (data.type === "eventIDs") {
			console.log("Event IDs:", data.data);
			setEventIds(data.data);
			// Reset receivedDutyDetails when new eventIDs are received
			setReceivedDutyDetails([]);
		} else if (data.type === "location") {
			console.log("Location data:", data.data);
			// Handle the location data here
			if (data.data.host === "ezy-crew.aims.aero") {
				// Cover the webview with a white screen
				setWebViewOverlay(true);
			} else {
				// PROD/TEST: Set to false for production
				setWebViewOverlay(false);
			}
		} else if (data.type === "dutyDetails") {
			console.log("Duty Details received for ID:", data.id);
			setReceivedDutyDetails((prev) => [...prev, data.id]);
		} else if (data.type === "extractedDutyDetails") {
			console.log("Extracted Duty Details data:", data.data, data.id);
		}
	};

	// Effect to close bottom sheet when all duty details are received
	useEffect(() => {
		if (eventIds.length > 0 && receivedDutyDetails.length === eventIds.length) {
			console.log("All duty details received. Closing bottom sheet.");
			bottomSheetModalRef.current?.close();
		}
	}, [eventIds, receivedDutyDetails]);

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
							snapPoints={["85%"]}
							ref={bottomSheetModalRef}
							onChange={handleSheetChanges}
							enablePanDownToClose
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
							<BottomSheetView
								style={{ flex: 1, flexGrow: 1, alignItems: "center" }}
							>
								<WebView
									style={{ flex: 1, height: "100%" }}
									injectedJavaScript={INJECTED_JAVASCRIPT}
									onMessage={handleWebViewMessage}
									// source={{ uri: "https://google.com" }}
									// PROD/TEST: Set to eCrew URL for production
									source={{ uri: "https://ezy-crew.aims.aero/eCrew/Dashboard" }}
								/>
								{webViewOverlay && (
									<View style={styles.overlay}>
										<View className="flex-col items-center">
											<Image
												source={require("../assets/logo/fittofly-icon-dark.png")}
												className="w-24 h-24 animate-spin"
											/>
											<Text className="mt-8 text-3xl text-gray-900 font-bold">
												Loading your roster...
											</Text>
											<Text className="mt-3 mb-24 text-xl text-gray-500 font-semibold">
												This may take up to 60 seconds
											</Text>
										</View>
									</View>
								)}
							</BottomSheetView>
						</BottomSheetModal>
					</SafeAreaProvider>
				</BottomSheetModalProvider>
			</GestureHandlerRootView>
		</SupabaseProvider>
	);
}
