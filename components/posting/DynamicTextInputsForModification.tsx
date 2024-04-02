import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import TextButton from "../common/TextButton";
import { fontSizes } from "../../utils/sizes";
import ImageButton from "../common/ImageButton";
import { log, logObject } from "../../utils/Log";
import { colors } from "../../utils/colors";

const DynamicTextInputsForModification = ({
	parentInputValues,
	setParentInputValues,
	isModifyingModalVisible,
	setSecondTexts,
	isExtraOptionEnabled,
	keys,
}: {
	parentInputValues: string[];
	setParentInputValues: React.Dispatch<React.SetStateAction<string[]>>;
	isModifyingModalVisible: boolean;
	setSecondTexts: React.Dispatch<React.SetStateAction<string[]>>;
	isExtraOptionEnabled: boolean;
	keys: any;
}) => {
	const [inputValues, setInputValues] = useState([""]);
	const inputRefs = useRef([]);

	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	useEffect(() => {
		console.log(
			`input values.length: ${inputValues.length}, inputRefs: ${inputRefs.current.length}`
		);
		const lastInputRef = inputRefs.current[inputRefs.current.length - 1];
		if (lastInputRef && lastInputRef.current) {
			console.log(`focused idx: ${inputRefs.current.length - 1}`);
			lastInputRef.current.focus();
		}
	}, [inputValues.length]);

	useEffect(() => {
		setParentInputValues(inputValues);
	}, [isModifyingModalVisible]);

	useEffect(() => {
		setSecondTexts(inputValues);
	}, [inputValues]);

	useEffect(() => {
		setInputValues(parentInputValues);
		while (inputRefs.current.length < parentInputValues.length) {
			inputRefs.current.push(React.createRef());
		}
	}, [parentInputValues]);

	useEffect(() => {
		return () => {
			logObject(`current input Values: `, inputValues);
			setParentInputValues(inputValues);
		};
	}, []);

	const handleAddInput = () => {
		console.log("add input called");
		setInputValues([...inputValues, ""]);
		inputRefs.current.push(React.createRef());
	};

	const handleInputChange = (text, index) => {
		const newInputValues = [...inputValues];
		newInputValues[index] = text; // 해당 인덱스의 입력 값을 업데이트
		setInputValues(newInputValues);
		console.log(`inputValues: ${inputValues}`);
	};

	const handleRemoveInput = (index) => {
		const newInputValues = [...inputValues];
		newInputValues.splice(index, 1); // 해당 인덱스의 입력 값을 제거
		setInputValues(newInputValues);
	};

	return (
		<TouchableWithoutFeedback onPress={dismissKeyboard}>
			<View style={styles.container}>
				{inputValues.map((value, index) => (
					// Inputs
					<View key={index} style={styles.inputContainer}>
						<TextInput
							key={keys[index]}
							ref={inputRefs.current[index]}
							placeholder={`옵션 ${index + 1}`}
							style={styles.input}
							value={value}
							onChangeText={(text) =>
								handleInputChange(text, index)
							}
							autoComplete="off"
							autoCorrect={false}
							onSubmitEditing={handleAddInput}
						/>
						<ImageButton
							img={require("../../assets/minusIcon.png")}
							onPress={() => handleRemoveInput(index)}
							backgroundStyle={{ marginLeft: 10 }}
						/>
					</View>
				))}
				{/* Extra Option */}
				{isExtraOptionEnabled && (
					<TextButton
						title="기타"
						onPress={() => {}}
						backgroundStyle={styles.extraBtnBG}
						hasShadow={false}
						textStyle={styles.extraBtnText}
						isEnabled={false}
					/>
				)}
				{/* Add Input Button  */}
				<TextButton
					title="Add Input"
					backgroundStyle={styles.addInputBG}
					textStyle={styles.addInputText}
					onPress={handleAddInput}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		// backgroundColor: "magenta",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
		justifyContent: "space-around",
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
	},
	extraBtnBG: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
	},
	extraBtnText: {
		color: colors.gray3,
		fontSize: fontSizes.s16,
		fontWeight: "400",
		textAlign: "left",
	},
	addInputBG: {
		borderRadius: 8,
		borderWidth: 1,
		borderColor: colors.gray4,
		overflow: "hidden",
		height: 30,
		backgroundColor: colors.white,
		// backgroundColor: colors.magenta,
	},
	addInputText: {
		color: colors.buttonText,
		textAlign: "center",
		fontSize: fontSizes.m20,
		overflow: "hidden",
	},
});

export default DynamicTextInputsForModification;
