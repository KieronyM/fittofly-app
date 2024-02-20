import { Text, View } from "react-native";

export default function TabThreeScreen() {
	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<Text className="text-4xl text-foreground font-extrabold tracking-tight lg:text-5xl">
				Stats Page
			</Text>
			<Text className="text-sm text-muted-foreground text-center">
				Stats will go here
			</Text>
		</View>
	);
}
