import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TextInput,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
	SafeAreaView,
} from "react-native";
import { fontSizes } from "../utils/sizes";
// import QuestionTypeSelectionBoxContainer from "../components/QuestionTypeSelectionBoxContainer";
import QuestionTypeSelectionBoxContainer from "../components/common/QuestionTypeSelectionBoxContainer";
import DynamicTextInputsForCreation from "../components/posting/DynamicTextInputsForCreation";
import { Question, QuestionBuilder } from "../interfaces/Question";
import { QuestionTypeId } from "../QuestionType";
import {
	SelectableOption,
	SelectableOptionBuilder,
} from "../interfaces/SelectableOption";
import { log, logObject } from "../utils/Log";
import { colors } from "../utils/colors";
import { screenHeight, screenWidth } from "../utils/ScreenSize";
import DefaultSwitch from "../components/common/DefaultSwitch";
import BottomButtonContainer from "../components/common/BottomButtonContainer";
import { ScrollView } from "react-native-gesture-handler";

interface CreatingQuestionModalProps {
	isCreatingQuestionModalVisible: boolean;
	onClose: () => void;
	onAdd: (question: Question) => void;
	position: number;
}

const CreatingQuestionModal: React.FC<CreatingQuestionModalProps> = ({
	isCreatingQuestionModalVisible,
	onClose,
	onAdd,
	position,
}) => {
	const [questionTitle, setQuestionTitle] = useState("");
	const [isExtraOptionEnabled, setIsExtraOptionEnabled] = useState(false);
	const [dynamicInputValues, setDynamicInputValues] = useState<string[]>([]);
	const [questionTypeId, SetQuestionTypeId] = useState<
		QuestionTypeId | undefined
	>(undefined);
	const [satisfied, setSatisfied] = useState<boolean>(false);
	const [placeHolder, setPlaceHolder] = useState<string>("");

	const handleConfirm = () => {
		if (!questionTypeId) {
			return;
		}

		let selectableOptions: SelectableOption[] = [];

		let question = new QuestionBuilder(
			position,
			questionTitle,
			questionTypeId,
			[]
		).build();

		if (!question.id) {
			return;
		}

		log(`question made: ${JSON.stringify(question)}`);

		if (questionTypeId === QuestionTypeId.Essay) {
			const selectableOption = new SelectableOptionBuilder(
				question.id,
				0,
				placeHolder,
				0
			).build();
			console.log("essay case, placeHolder", placeHolder);
			selectableOptions.push(selectableOption);
		} else {
			if (!question.id) {
				return;
			}
			dynamicInputValues.map((optionText, index) => {
				if (optionText !== "") {
					const selectableOption = new SelectableOptionBuilder(
						question.id,
						index,
						optionText,
						0
					).build();

					selectableOptions.push(selectableOption);
				}
			});

			if (isExtraOptionEnabled) {
				const selectableOption = new SelectableOptionBuilder(
					question.id,
					dynamicInputValues.length,
					"기타",
					1
				).build();

				selectableOptions.push(selectableOption);
			}
		}

		question.selectableOptions = selectableOptions;
		logObject("question added", question);
		onAdd(question);

		setIsExtraOptionEnabled(false);
	};

	const toggleExtraOptionSwitch = () => {
		setIsExtraOptionEnabled((prev) => !prev);
	};

	useEffect(() => {
		console.log(`isExtraOptionEnabled: ${isExtraOptionEnabled}`);
	}, [isExtraOptionEnabled]);

	const handleModalClose = () => {
		console.log(`dynamicInputValues: ${dynamicInputValues}`);
		setIsExtraOptionEnabled(false);
		onClose();
	};

	useEffect(() => {
		if (
			questionTypeId !== undefined &&
			questionTitle !== "" &&
			dynamicInputValues[0] !== ""
		) {
			setSatisfied(true);
			console.log(`satisfied: true`);
		} else if (
			questionTypeId === QuestionTypeId.Essay &&
			questionTitle !== ""
		) {
			setSatisfied(true);
		} else {
			setSatisfied(false);
		}
	}, [questionTypeId, questionTitle, dynamicInputValues]);

	useEffect(() => {
		// setDynamicInputValues([""]);
		setDynamicInputValues([]);
		setQuestionTitle("");
		setPlaceHolder("답변을 입력해주세요");
		SetQuestionTypeId(undefined);
	}, [isCreatingQuestionModalVisible]);

	const handleDismissKeyboard = () => {
		Keyboard.dismiss();
	};

	const [isFocused, setIsFocused] = useState(false);

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	useEffect(() => {
		setIsFocused(false);
	}, []);

	return (
		<Modal
			// animationType="slide"
			// animationType="fade"
			transparent={true}
			visible={isCreatingQuestionModalVisible}
			onRequestClose={handleModalClose}
			hardwareAccelerated={true}
		>
			<TouchableWithoutFeedback onPress={handleDismissKeyboard}>
				<SafeAreaView style={styles.modalContainer}>
					<ScrollView
						style={styles.scrollView}
						contentContainerStyle={styles.scrollViewContent}
					>
						<View>
							<TextInput
								placeholder={
									isFocused ? "" : "질문을 입력해주세요"
								}
								style={styles.questionTextStyle}
								value={questionTitle}
								onChangeText={setQuestionTitle}
								autoComplete="off"
								autoCorrect={false}
								multiline={true}
								clearTextOnFocus={true}
								onFocus={handleFocus}
								onBlur={handleBlur}
							/>
							<View style={{ height: 16 }} />
							<QuestionTypeSelectionBoxContainer
								handleSelect={SetQuestionTypeId}
							/>

							<View>
								{/* 서술형 질문 */}
								{questionTypeId === QuestionTypeId.Essay ? (
									<View
										style={{
											width: screenWidth - 80,
											marginTop: 60,
											marginLeft: 20,
										}}
									>
										<TextInput
											style={{
												fontSize: fontSizes.m20,
												color: colors.gray3,
											}}
											onChangeText={setPlaceHolder}
											placeholder={placeHolder}
											autoComplete="off"
										/>
										<View
											style={{
												backgroundColor: colors.gray2,
												height: 1,
												marginTop: 5,
											}}
										/>
									</View>
								) : [
										QuestionTypeId.SingleSelection,
										QuestionTypeId.MultipleSelection,
								  ].includes(questionTypeId) ? (
									// 단일 선택, 다중 선택 질문
									<View>
										{/* {dynamicInputValues.length !== 0 && ( */}
										<DynamicTextInputsForCreation
											dynamicInputValues={
												dynamicInputValues
											}
											setDynamicInputValues={
												setDynamicInputValues
											}
											// keys={dynamicInputValues.map(
											//     (_, index) =>
											//         index.toString()
											// )}
											keys={() => {
												dynamicInputValues.length !== 0
													? dynamicInputValues.map(
															(_, index) =>
																index.toString()
													  )
													: "empty-key";
											}}
											isExtraOptionEnabled={
												isExtraOptionEnabled
											}
										/>
										{/* )} */}
									</View>
								) : (
									<View />
								)}
							</View>
						</View>
						{/* Extra Option Switch & Bottom */}
						<View>
							<View style={{ flex: 1 }}>
								{questionTypeId === QuestionTypeId.Essay ? (
									<View>
										<BottomButtonContainer
											leftTitle="닫기"
											leftAction={handleModalClose}
											rightAction={handleConfirm}
											satisfied={satisfied}
										/>
									</View>
								) : [
										QuestionTypeId.SingleSelection,
										QuestionTypeId.MultipleSelection,
								  ].includes(questionTypeId) ? (
									<View>
										<View
											style={styles.extraOptionContainer}
										>
											<Text
												style={{
													fontSize: fontSizes.m20,
												}}
											>
												기타 옵션 추가
											</Text>
											<DefaultSwitch
												onValueChange={
													toggleExtraOptionSwitch
												}
												value={isExtraOptionEnabled}
											/>
										</View>
										<View>
											<BottomButtonContainer
												leftTitle="닫기"
												leftAction={handleModalClose}
												rightAction={handleConfirm}
												satisfied={satisfied}
											/>
										</View>
									</View>
								) : (
									<View>
										<BottomButtonContainer
											leftTitle="닫기"
											leftAction={handleModalClose}
											rightAction={handleConfirm}
											satisfied={satisfied}
										/>
									</View>
								)}
							</View>
						</View>
					</ScrollView>
				</SafeAreaView>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	questionTextStyle: {
		marginTop: 60,
		textAlign: "center",
		fontSize: fontSizes.m20,
		paddingHorizontal: 12,
	},
	modalContainer: {
		flex: 1,
		backgroundColor: colors.modalBackground,
	},
	modalContent: {
		flexGrow: 1,
		marginTop: 20,
		minHeight: screenHeight * 0.9,
		maxHeight: screenHeight * 0.9,
		marginHorizontal: 20,
		backgroundColor: colors.brightBackground,
		borderRadius: 10,
		justifyContent: "space-between",
	},
	scrollView: {
		marginHorizontal: 12,
		marginVertical: 20,
		borderRadius: 12,
		backgroundColor: colors.brightBackground,
		flex: 1,
	},
	scrollViewContent: {
		justifyContent: "space-between",
		flexGrow: 1,
	},
	bottomLeftButtonTextContainer: {
		flexGrow: 1,
		flexDirection: "row",
		justifyContent: "center",
		borderTopWidth: 1,
		borderRightWidth: 1,
		height: 40,
		alignItems: "center",
		margin: 0,
		backgroundColor: colors.white,
		borderBottomLeftRadius: 10,
	},
	bottomRightButtonTextContainer: {
		flexGrow: 1,
		flexDirection: "row",
		justifyContent: "center",
		borderTopWidth: 1,
		height: 40,
		alignItems: "center",
		margin: 0,
	},
	bottomTextStyle: {
		textAlign: "center",
		fontSize: fontSizes.s16,
	},
	inactivatedStyle: {
		backgroundColor: colors.gray2,
		borderBottomRightRadius: 10,
	},
	activatedStyle: {
		backgroundColor: colors.white,
		borderBottomRightRadius: 10,
	},
	extraOptionContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginHorizontal: 30,
	},
});

export default CreatingQuestionModal;
