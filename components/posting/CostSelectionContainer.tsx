import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Touchable,
} from "react-native";
import { commonStyles } from "../../utils/CommonStyles";
import { colors } from "../../utils/colors";
import SingleSelectionButton from "./SingleSelectionButton";
import { fontSizes } from "../../utils/sizes";

interface CostSelectionProps {
	initialIndex: number;
	toggleFreeState: (boolean) => void;
}

const CostSelectionContainer: React.FC<CostSelectionProps> = ({
	initialIndex,
	toggleFreeState,
}) => {
	const [selectedIndex, setSelectedIndex] = useState(initialIndex);
	return (
		<View style={{ flexDirection: "row", gap: 5 }}>
			<SingleSelectionButton
				index={0}
				title="Free"
				selectedIndex={selectedIndex}
				onPress={() => {
					setSelectedIndex(0);
					toggleFreeState(true);
				}}
				backgroundStyle={styles.buttonContainer}
				textStyle={{ textAlign: "center" }}
				unselectedTextStyle={{ color: colors.gray }}
				unselectedBackgroundStyle={{
					backgroundColor: colors.transparent,
				}}
				selectedTextStyle={{
					color: colors.white,
					fontWeight: "bold",
					fontSize: fontSizes.s16,
				}}
				selectedBackgroundStyle={{ backgroundColor: colors.black }}
			/>

			<SingleSelectionButton
				index={1}
				title="Paid"
				selectedIndex={selectedIndex}
				onPress={() => {
					setSelectedIndex(1);
					toggleFreeState(false);
				}}
				textStyle={{ textAlign: "center" }}
				backgroundStyle={styles.buttonContainer}
				unselectedTextStyle={{ color: colors.gray }}
				unselectedBackgroundStyle={{
					backgroundColor: colors.transparent,
				}}
				selectedTextStyle={{
					color: colors.white,
					fontWeight: "bold",
					fontSize: fontSizes.s16,
				}}
				selectedBackgroundStyle={{ backgroundColor: colors.black }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		borderRadius: 5,
		height: 40,
		// width: 80,
		flex: 1,
		justifyContent: "center",
		borderWidth: 1,
		overflow: "hidden",
	},
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	label: {
		fontSize: 24,
		marginBottom: 20,
	},
	slider: {
		width: 300,
		height: 40,
		marginBottom: 20,
	},
	button: {
		backgroundColor: "#007bff",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
	},
	buttonText: {
		color: "#ffffff",
		fontSize: 18,
	},
});

export default CostSelectionContainer;
