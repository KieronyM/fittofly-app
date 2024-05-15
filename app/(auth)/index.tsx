import { useRouter } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui";
import { LinearGradient } from "expo-linear-gradient";

const styles = StyleSheet.create({
	image: {
		height: 60,
		width: 260,
	},
});

export default function WelcomeScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	return (
		<LinearGradient colors={["#38bcf8", "#0370a1"]} style={{ height: "100%" }}>
			<View
				className="flex flex-1 bg-background p-4"
				// HACK: This is a workaround for the SafeAreaView className prop not working
				style={{
					paddingTop: insets.top,
					paddingBottom: insets.bottom,
					backgroundColor: "rgba(0,0,0,0)",
				}}
			>
				<View className="flex flex-1 items-center justify-center gap-y-4">
					<Image
						style={styles.image}
						source={
							// colorScheme === "dark"
							// 	?
							require("../../assets/logo/fittofly-ultra-dark-3.png")
							// : require("../assets/logo/fittofly-test.png")
						}
					/>
				</View>
				<View className="flex flex-row gap-x-4">
					<Button
						className="flex-1"
						size="lg"
						variant="secondary"
						onPress={() => {
							router.push("/sign-up");
						}}
					>
						Sign up
					</Button>
					<Button
						className="flex-1"
						size="lg"
						variant="default"
						onPress={() => {
							router.push("/sign-in");
						}}
					>
						Sign in
					</Button>
				</View>
			</View>
		</LinearGradient>
	);
}
