import { Text, View } from "react-native";

export default function TabOneScreen() {
	return (
		<View className="flex-1 bg-background p-4 gap-y-4">
			<Text className="text-3xl text-foreground font-extrabold tracking-tight lg:text-5xl">
				Welcome back, Kieran 👋
			</Text>
			<Text className="text-md text-muted-foreground">
				Your roster looks good for this period - take a look below.
			</Text>
		</View>
	);
}
