import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ParticipatingQuestionProps {
	position: number;
	id: number;
	text: string;
}

const ParticipatingQuestionTextBox: React.FC<ParticipatingQuestionProps> = ({
	position,
	id,
	text,
}) => {
	return (
		<View style={styles.container}>
			<Text style={styles.textStyle}>
				{position + 1}. {text}
			</Text>
		</View>
	);
};

export default ParticipatingQuestionTextBox;

const styles = StyleSheet.create({
	container: {
		marginLeft: 16,
		marginRight: 16,
		marginBottom: 12, // spacing between q and selectable-option
	},
	textStyle: {
		fontSize: 18,
		fontWeight: "bold",
	},
});
