import {
	Modal,
	StyleSheet,
	View,
	Text,
	Keyboard,
	TouchableOpacity,
	Animated,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { colors } from "../utils/colors";
import { fontSizes } from "../utils/sizes";
import { screenHeight, screenWidth } from "../utils/ScreenSize";
import TextButton from "../components/common/TextButton";
import { useEffect, useRef, useState } from "react";
import { modalStyles } from "../utils/CommonStyles";
import BottomButtonContainer from "../components/common/BottomButtonContainer";
import Spacer from "../components/common/Spacer";
// import { createWithdrawal, patchWithdrawal } from "../API/WithdrawalAPI";
import { useCustomContext } from "../features/context/CustomContext";
import { Withdrawal } from "../interfaces/Withdrawal";
import showToast from "../utils/toast/Toast";
import showAdminToast from "../utils/toast/showAdminToast";
import { WithdrawalService } from "../API/Services/WithdrawalService";

interface WithdrawalModalProps {
	isModalVisible: boolean;
	onClose: () => void;
	onConfirm: () => void;
	totalPoint: number;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
	isModalVisible,
	onClose,
	onConfirm,
	totalPoint,
}) => {
	const withdrawalService = new WithdrawalService();
	// await withdrawalService.create(accessToken, userId, amount);
	// 계좌번호
	const [accountNumber, setAccountNumber] = useState("");
	const [holderName, setHolderName] = useState("");
	const [bankName, setBankName] = useState("");
	const [amount, setAmount] = useState(0);

	const translateY = useRef(new Animated.Value(0)).current;
	const [satisfied, setSatisfied] = useState(false);

	const { accessToken, userId, updateLoadingStatus } = useCustomContext();
	const [confirmTapped, setConfirmTapped] = useState(false);

	useEffect(() => {
		setAccountNumber("");
		setHolderName("");
		setBankName("");
		setAmount(0);
	}, [isModalVisible]);
	useEffect(() => {
		setSatisfied(
			accountNumber !== "" &&
				holderName !== "" &&
				amount !== 0 &&
				amount <= totalPoint &&
				bankName !== ""
		);
	}, [accountNumber, holderName, amount, bankName]);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardWillShow",
			() => {
				Animated.timing(translateY, {
					toValue: -150,
					duration: 200,
					useNativeDriver: true,
				}).start();
			}
		);

		const keyboardDidHideListener = Keyboard.addListener(
			"keyboardWillHide",
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

	const handleConfirm = () => {
		setConfirmTapped(true);
	};

	const handleWithdrawal = async () => {
		updateLoadingStatus(true);

		try {
			const withdrawal: ApiResponse<Withdrawal> =
				await withdrawalService.create(
					accessToken,
					userId,
					amount,
					accountNumber,
					bankName,
					holderName
				);
			await withdrawalService.patch(accessToken, withdrawal.data.id);

			showToast("success", `${amount} 원이 출금되었습니다.`);
			onConfirm();
		} catch (error) {
			showAdminToast("error", error);
		} finally {
			updateLoadingStatus(false);
		}
	};

	useEffect(() => {
		if (confirmTapped) {
			handleWithdrawal();
			setConfirmTapped(false);
		}
	}, [confirmTapped, amount]);

	return (
		<Modal transparent={true} visible={isModalVisible}>
			<Animated.View style={{ transform: [{ translateY: translateY }] }}>
				<TouchableOpacity
					style={styles.modalContainer}
					onPress={() => {
						Keyboard.dismiss();
					}}
					activeOpacity={1}
				>
					<View style={styles.modalContent}>
						{/* Title */}
						<View
							style={{
								marginTop: 30,
								alignItems: "center",
								marginHorizontal: 30,
							}}
						>
							<Text style={{ fontSize: 22, fontWeight: "800" }}>
								출금
							</Text>
							<Spacer size={10} />
							<Text>
								계좌 정보가 정상적으로 확인되지 않을 시 출금되지
								않습니다.
							</Text>
							<Spacer size={10} />
						</View>
						<Spacer size={20} />
						<View style={{ width: 300, gap: 6 }}>
							{/* 이름 입력 */}
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Text>예금 주</Text>
								<Spacer size={10} />
								<View style={styles.rowContainer}>
									<Spacer size={10} />
									<TextInput
										style={styles.searchInput}
										keyboardType="default"
										value={holderName}
										onChangeText={setHolderName}
									/>
								</View>
							</View>

							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Text>계좌번호</Text>
								<Spacer size={10} />
								<View style={styles.rowContainer}>
									<Spacer size={10} />
									<TextInput
										style={styles.searchInput}
										keyboardType="number-pad"
										value={accountNumber}
										onChangeText={setAccountNumber}
									/>
								</View>
							</View>

							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Text>은행 명</Text>
								<Spacer size={10} />
								<View style={styles.rowContainer}>
									<Spacer size={10} />
									<TextInput
										style={styles.searchInput}
										keyboardType="default"
										value={bankName}
										onChangeText={setBankName}
									/>
								</View>
							</View>

							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Text>인출할 포인트</Text>
								<Spacer size={10} />
								<View style={styles.rowContainer}>
									<Spacer size={10} />
									<TextInput
										style={styles.searchInput}
										keyboardType="number-pad"
										value={`${amount}`}
										placeholder=""
										onChangeText={(amt) => {
											setAmount(Number(amt));
										}}
									/>
								</View>
							</View>
							<View style={{ alignSelf: "flex-end" }}>
								<Text>{totalPoint} P 인출 가능</Text>
							</View>
						</View>

						<BottomButtonContainer
							leftAction={onClose}
							rightTitle="출금"
							rightAction={() => {
								handleConfirm();
							}}
							satisfied={satisfied}
						/>
					</View>
				</TouchableOpacity>
			</Animated.View>
		</Modal>
	);
};

const styles = StyleSheet.create({
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
		height: 440,
		marginHorizontal: 40,
		backgroundColor: colors.brightBackground,
		borderRadius: 10,
		overflow: "hidden",
		justifyContent: "space-between",
		alignItems: "center",
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
	mainContent: {
		flexDirection: "column",
		justifyContent: "center",
		flex: 1,
		gap: 30,
		marginHorizontal: 20,
	},
	searchInput: {
		fontSize: 16,
		textAlignVertical: "center",
		paddingLeft: 10,
	},
	rowContainer: {
		borderWidth: 1,
		borderRadius: 6,
		width: 200,
		height: 40,
	},
});
