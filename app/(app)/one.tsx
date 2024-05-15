import { Text, View } from "react-native";

export default function TabOneScreen() {
	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<Text className="text-4xl text-foreground font-extrabold tracking-tight lg:text-5xl">
				FAQs
			</Text>
			<Text className="text-md text-muted-foreground text-center">
				FAQs will go here
			</Text>
		</View>
	);
}
