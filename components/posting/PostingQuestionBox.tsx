import React from "react";
import { Question } from "../../interfaces/Question";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { colors } from "../../utils/colors";
import { QuestionTypeId } from "../../QuestionType";
import { fontSizes } from "../../utils/sizes";
import { Feather } from "@expo/vector-icons";
import { SelectionImage } from "../../utils/ImageNameType";

// Question 을 받도록, 전체가 버튼.

interface QuestionButtonProps {
	question: Question;
	onPress?: () => void;
}

const PostingQuestionBox: React.FC<QuestionButtonProps> = ({
	question,
	onPress,
}) => {
	return (
		<TouchableOpacity style={styles.questionContainer} onPress={onPress}>
			<Text style={{ fontSize: fontSizes.m20, paddingLeft: 4 }}>
				{question.position + 1}. {question.text}
			</Text>
			<View style={{ height: 10 }} />

			{question.selectableOptions.map((option) => (
				<React.Fragment key={option.id}>
					{(() => {
						switch (question.questionTypeId) {
							case QuestionTypeId.SingleSelection:
								return (
									<View style={styles.rowContainer}>
										<Feather
											name={
												SelectionImage.unselectedSingleSelection
											}
											size={20}
											color={colors.black}
										/>
										<View style={{ width: 10 }}></View>
										<Text>{option.value}</Text>
									</View>
								);

							case QuestionTypeId.MultipleSelection:
								return (
									<View style={styles.rowContainer}>
										<Feather
											name={
												SelectionImage.unselectedMultipleSelection
											}
											size={20}
											color={colors.black}
										/>
										<View style={{ width: 10 }}></View>
										<Text>{option.value}</Text>
									</View>
								);
							case QuestionTypeId.Essay:
								return (
									<View>
										<Text
											style={{
												marginHorizontal: 8,
												color: colors.gray3,
											}}
										>
											{option.value}
										</Text>
									</View>
								);
						}
					})()}
				</React.Fragment>
			))}
		</TouchableOpacity>
	);
};

export default React.memo(PostingQuestionBox);

const styles = StyleSheet.create({
	questionContainer: {
		padding: 10,
		paddingLeft: 20,
		backgroundColor: colors.white,
		borderRadius: 10,
		borderColor: colors.gray4,
		borderWidth: 1,
		overflow: "hidden",
	},
	questionWithIndex: {
		flexDirection: "row",
	},
	rowContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 7,
		height: 20,
	},
});
