import React, { useState } from "react";
import {
	View,
	TouchableOpacity,
	Text,
	StyleSheet,
	FlatList,
	ListRenderItem,
	Dimensions,
} from "react-native";
import { colors } from "../utils/colors";
// import { Dimensions } from 'react-native'
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export interface SegmentProps {
	item: string;
	index: number;
}

interface CustomSegmentedControlProps {
	options: string[];
	handlePress: (num: number) => void;
}

const CustomSegmentedControl: React.FC<CustomSegmentedControlProps> = ({
	options,
	handlePress,
}) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleSegmentPress = (index) => {
		setSelectedIndex(index);
	};

	const myrenderItem: ListRenderItem<SegmentProps> = ({ item }) => {
		return (
			<TouchableOpacity
				style={[
					{ width: (screenWidth - 60) / 2 },
					styles.segment,
					selectedIndex === item.index && styles.selectedSegment,
				]}
				onPress={() => {
					handleSegmentPress(item.index);
					handlePress(item.index);
				}}
			>
				<Text
					style={[
						styles.segmentText,
						selectedIndex === item.index &&
							styles.selectedSegmentText,
					]}
				>
					{item.item}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={options.map((item, index) => {
					const seg: SegmentProps = { item, index };
					return seg;
				})}
				renderItem={myrenderItem}
				keyExtractor={(item) => `${item.index}`}
				horizontal={true}
				style={{ flex: 1 }}
				contentContainerStyle={{ justifyContent: "space-around" }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#eee",
		borderRadius: 8,
		overflow: "hidden",
		height: 40,
		flex: 1,
	},
	segment: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 10,
		backgroundColor: "#a7a7a7",
	},
	selectedSegment: {
		backgroundColor: colors.white,
	},
	segmentText: {
		color: "#d1d1d1",
	},
	selectedSegmentText: {
		color: colors.black,
	},
});

export default CustomSegmentedControl;
