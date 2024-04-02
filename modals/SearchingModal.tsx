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
import { useEffect, useRef, useState } from "react";
import BottomButtonContainer from "../components/common/BottomButtonContainer";
import React from "react";

interface SearhchingModalProps {
	onSearchAction: () => void;
	searchText: string;
	onClose: () => void;
	title: string;
	isModalVisible: boolean;
	searchingCode: string;
	setSearchingCode: (text) => void;
}

export const SearchingModal: React.FC<SearhchingModalProps> = ({
	onSearchAction,
	title,
	isModalVisible,
	searchText: secondSelectionText,
	onClose,
	searchingCode,
	setSearchingCode,
}) => {
	const [isSatisfied, setSatisfied] = useState(false);

	useEffect(() => {
		setSatisfied(searchingCode.length === 7);
	}, [searchingCode]);

	const translateY = useRef(new Animated.Value(0)).current;

	const [isKeyboardAvailable, setKeyboardAvailable] = useState(false);
	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardWillShow",
			() => {
				Animated.timing(translateY, {
					toValue: -100,
					duration: 200,
					useNativeDriver: true,
				}).start();
				setKeyboardAvailable(true);
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
				setKeyboardAvailable(false);
			}
		);

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, [translateY]);
	// ZMJNWTH

	const backgroundTapAction = () => {
		// console.log(`keyboard dismiss?: ${Keyboard.dismiss}`);
		console.log(`keyboard dismiss?: ${isKeyboardAvailable}`);
		if (isKeyboardAvailable) {
			Keyboard.dismiss();
		} else {
			onClose();
		}
	};

	return (
		<Modal transparent={true} visible={isModalVisible} animationType="fade">
			<Animated.View style={{ transform: [{ translateY: translateY }] }}>
				<TouchableOpacity
					style={styles.modalContainer}
					onPress={backgroundTapAction}
					activeOpacity={1}
				>
					<TouchableOpacity
						style={styles.modalContent}
						onPress={() => {}}
						activeOpacity={1}
					>
						{/* Title */}
						<View style={{ marginTop: 30, alignItems: "center" }}>
							<Text style={{ fontSize: 22, fontWeight: "800" }}>
								{title}
							</Text>
						</View>
						{/* Search */}
						<View
							style={{
								alignItems: "center",
							}}
						>
							<View style={styles.searchContainer}>
								<TextInput
									style={styles.searchInput}
									autoCapitalize="characters"
									keyboardType="default"
									value={searchingCode}
									onChangeText={setSearchingCode}
								/>
							</View>
						</View>
						<BottomButtonContainer
							rightTitle={secondSelectionText}
							leftAction={() => {
								onClose();
							}}
							rightAction={() => {
								onSearchAction();
								onClose();
							}}
							satisfied={isSatisfied}
						/>
					</TouchableOpacity>
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
		height: 240,
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
	searchInput: {
		fontSize: 20,
		textAlignVertical: "center",
		paddingLeft: 10,
	},
	searchContainer: {
		borderWidth: 1,
		borderRadius: 6,
		width: 200,
		height: 40,
		justifyContent: "center",
	},
});
