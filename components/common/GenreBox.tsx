import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../utils/colors";
import React from "react";

export const GenreBox: React.FC<{ name: string }> = ({ name }) => {
	return (
		<View style={styles.genreBox}>
			<Text style={{ color: colors.white, fontWeight: "500" }}>
				{name}
			</Text>
		</View>
	);
};

export default React.memo(GenreBox);

const styles = StyleSheet.create({
	genreBox: {
		marginRight: 10,
		borderRadius: 6,
		backgroundColor: colors.gray3,
		padding: 6,
	},
});
