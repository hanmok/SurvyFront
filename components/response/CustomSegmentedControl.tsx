import React, { useState } from "react";
import {
	View,
	TouchableOpacity,
	Text,
	StyleSheet,
	FlatList,
	ListRenderItem,
} from "react-native";
import { colors } from "../../utils/colors";
import { screenWidth } from "../../utils/ScreenSize";

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

	const renderItem: ListRenderItem<SegmentProps> = ({ item }) => {
		return (
			<TouchableOpacity
				style={[
					{
						width: (screenWidth - 24) / 2,
						borderTopLeftRadius: item.index === 0 ? 6 : 0,
						borderBottomLeftRadius: item.index === 0 ? 6 : 0,

						borderTopRightRadius: item.index === 1 ? 6 : 0,
						borderBottomRightRadius: item.index === 1 ? 6 : 0,
					},
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
				renderItem={renderItem}
				keyExtractor={(item) => `${item.index}`}
				horizontal={true}
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
		letterSpacing: 2,
		fontSize: 16,
	},
	selectedSegmentText: {
		color: colors.black,
	},
});

export default CustomSegmentedControl;
