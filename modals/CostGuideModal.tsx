import {
	Animated,
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { fontSizes } from "../utils/sizes";
import { colors } from "../utils/colors";
import { useEffect, useRef, useState } from "react";
import { screenHeight, screenWidth } from "../utils/ScreenSize";
import CostSelectionContainer from "../components/posting/CostSelectionContainer";
import * as accounting from "accounting";
import BottomButtonContainer from "../components/common/BottomButtonContainer";
import showToast from "../utils/toast/Toast";
import Toast from "react-native-toast-message";
import toastConfig from "../utils/toast/ToastConfig";
import React from "react";
interface CostGuideModalProps {
	onClose: () => void;
	onConfirm: () => void;
	isCostGuideModalVisible: boolean;
	expectedTimeInMin: number;
	participationGoal: string;
	setParticipationGoal: (string) => void;
	setIsFree: (boolean) => void;
	isFree: boolean;
	price: string;
	setPrice: (string) => void;
}

const CostGuideModal: React.FC<CostGuideModalProps> = ({
	onClose,
	onConfirm,
	isCostGuideModalVisible,
	expectedTimeInMin,
	setIsFree,
	isFree,
	price,
	setPrice,
	setParticipationGoal,
	participationGoal,
}) => {
	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	const handleParticipationGoalChage = (text) => {
		const [minValue, maxValue] = [1, 30];

		const numericValue = parseInt(text);

		if (numericValue < minValue) {
			const str = "1";
			setParticipationGoal(str);
			showToast("error", "설문 인원은 1명 이상이어야 합니다");
		} else if (numericValue > maxValue) {
			const str = "30";
			setParticipationGoal(str);
			showToast("error", "설문 인원은 30명 이하까지 가능합니다");
		} else {
			const str = numericValue.toString();
			setParticipationGoal(str);
		}
	};

	const participationGoalRef = useRef(null);

	useEffect(() => {
		if (isCostGuideModalVisible && participationGoalRef.current) {
			participationGoalRef.current.focus();
		}
	}, [isCostGuideModalVisible]);

	useEffect(() => {
		console.log(`[CostGuideModal], isFree: ${isFree}, price: ${price}`);
		if (isFree) {
			setPrice("0");
		} else {
			const value = parseInt(participationGoal) * 300 * expectedTimeInMin;
			const numWithComma = accounting.formatMoney(value, {
				symbol: "",
				precision: 0,
				thousand: ",",
			});

			setPrice(`${numWithComma}`);
		}
	}, [price, isFree, isCostGuideModalVisible, participationGoal]);

	const translateY = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
			() => {
				console.log(`keyboardDidShow called`);

				Animated.timing(translateY, {
					toValue: -150,
					duration: 200,
					useNativeDriver: true,
				}).start();
			}
		);

		const keyboardDidHideListener = Keyboard.addListener(
			Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
			() => {
				// Animate modal content when the keyboard hides
				Animated.timing(translateY, {
					toValue: 0,
					duration: 200,
					useNativeDriver: true,
				}).start();
			}
		);

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, [translateY]);

	return (
		<Modal transparent={true} visible={isCostGuideModalVisible}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<Animated.View
					style={{ transform: [{ translateY: translateY }] }}
				>
					<TouchableWithoutFeedback onPress={dismissKeyboard}>
						<View style={styles.modalContainer}>
							<Toast config={toastConfig} />
							<View style={styles.modalContent}>
								<Text style={styles.titleText}>설문 제출</Text>
								<View style={{ height: 200, width: 300 }}>
									<View style={styles.mainContent}>
										<View style={styles.rowContainer}>
											<Text
												style={{
													fontSize: fontSizes.s16,
												}}
											>
												설문 인원
											</Text>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
												}}
											>
												<TextInput
													value={participationGoal}
													onChangeText={
														// setParticipationGoal
														handleParticipationGoalChage
													}
													keyboardType="number-pad"
													placeholder="10"
													selectTextOnFocus={true} // for android
													clearTextOnFocus={true} // for ios
													style={
														styles.participationGoalTextInput
													}
												/>
												<Text
													style={{
														fontSize: fontSizes.s16,
													}}
												>
													{" "}
													명
												</Text>
											</View>
										</View>

										<View style={styles.rowContainer}>
											<Text
												style={{
													fontSize: fontSizes.s16,
												}}
											>
												예상 소요 시간
											</Text>
											<Text
												style={{
													fontSize: fontSizes.s16,
												}}
											>
												{" "}
												{expectedTimeInMin} 분
											</Text>
										</View>
										{/* <View style={styles.rowContainer}>
                                            <Text
                                                style={{
                                                    fontSize: fontSizes.s16,
                                                }}
                                            >
                                                가격
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: fontSizes.s16,
                                                }}
                                            >
                                                {price} 원
                                            </Text>
                                        </View> */}
										{/* <View
                                            style={[
                                                {
                                                    alignItems: "center",
                                                    flexDirection: "column",
                                                },
                                            ]}
                                        >
                                            <CostSelectionContainer
                                                initialIndex={isFree ? 0 : 1}
                                                toggleFreeState={setIsFree}
                                            />
                                        </View> */}
									</View>
								</View>
								<BottomButtonContainer
									leftAction={onClose}
									rightAction={onConfirm}
								/>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Animated.View>
			</KeyboardAvoidingView>
		</Modal>
	);
};
export default CostGuideModal;

const styles = StyleSheet.create({
	// modalContainer: {
	//     flex: 1,
	//     backgroundColor: colors.modalBackground,
	//     borderWidth: 1,
	//     borderColor: colors.black,
	//     borderRadius: 20,
	//     overflow: "hidden",
	// },
	modalContainer: {
		width: screenWidth,
		height: screenHeight,
		backgroundColor: colors.modalBackground,
		borderWidth: 1,
		borderColor: colors.black,
		borderRadius: 20,
		overflow: "hidden",
		justifyContent: "center",
	},
	modalContent: {
		flexGrow: 1,
		marginVertical: 240, // 전체 화면 관리
		marginHorizontal: 40,
		backgroundColor: colors.brightBackground,
		borderRadius: 10,
		overflow: "hidden",
		justifyContent: "space-between",
		alignItems: "center",
	},
	titleText: {
		fontSize: fontSizes.m20,
		backgroundColor: colors.gray4,
		width: screenWidth - 40 * 2,
		textAlign: "center",
		paddingVertical: 10,
	},
	participationGoalTextInput: {
		fontSize: fontSizes.s16,
		color: colors.gray2,
		borderColor: colors.gray3,
		borderWidth: 1,
		borderRadius: 6,
		minWidth: 50,
		textAlign: "right",
		paddingRight: 6,
		backgroundColor: colors.white,
	},
	bottomContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	bottomTextStyle: {
		textAlign: "center",
		fontSize: fontSizes.s16,
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
		borderBottomLeftRadius: 10,
		backgroundColor: colors.white,
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
	inactivatedStyle: {
		backgroundColor: colors.gray2,
	},
	activatedStyle: {
		backgroundColor: colors.white,
	},
	rowContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	mainContent: {
		flexDirection: "column",
		justifyContent: "center",
		flex: 1,
		gap: 30,
		marginHorizontal: 20,
	},
});
