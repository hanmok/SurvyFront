// ZMJNWTH

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
import React, { useContext, useEffect, useRef, useState } from "react";
import BottomButtonContainer from "../components/common/BottomButtonContainer";
import { Survey } from "../interfaces/Survey";
import { useCustomContext } from "../features/context/CustomContext";
import { convertReward, convertToMin } from "../utils/numbers";
import Spacer from "../components/common/Spacer";
// import { GenreBox } from "../components/common/GenreBox";
import GenreBox from "../components/common/GenreBox";

interface SearchedSurveyModalProps {
	onConfirmAction: () => void;
	confirmText: string;
	onClose: () => void;
	// title: string;
	isModalVisible: boolean;
	searchedSurvey: Survey | null;
}

export const SearchedSurveyModal: React.FC<SearchedSurveyModalProps> = ({
	onConfirmAction: onSecondSelection,
	// title,
	isModalVisible: isSearchedModalVisible,
	confirmText,
	onClose,
	searchedSurvey,
}) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;

	// Animation 범위가 바뀌어야 할 것 같은데 ??
	useEffect(() => {
		// when modal opens, apply fade in animation
		if (isSearchedModalVisible) {
			Animated.timing(fadeAnim, {
				// toValue: 0.7,
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		} else {
			// when modal closes, apply fade out animation
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}
	});

	return (
		<Modal
			transparent={true}
			visible={isSearchedModalVisible}
			animationType="fade"
		>
			<Animated.View
				style={[
					styles.modalContainer,
					{ backgroundColor: colors.transparent, opacity: fadeAnim },
				]}
			>
				<TouchableOpacity
					style={styles.modalContainer}
					onPress={() => {
						// Keyboard.dismiss();
						onClose();
					}}
					activeOpacity={1}
				>
					<TouchableOpacity
						style={styles.modalContent}
						activeOpacity={1}
						onPress={() => {}}
					>
						<View
							style={{
								alignItems: "center",
								marginTop: 30,
							}}
						>
							<View style={{ alignItems: "center" }}>
								<Text
									style={{ fontSize: 22, fontWeight: "800" }}
								>
									{searchedSurvey?.title}
								</Text>
								<View style={{ height: 20 }} />
								<Text
									style={{ fontSize: 18, fontWeight: "400" }}
								>
									{convertToMin(
										searchedSurvey?.expectedTimeInSec
									)}{" "}
									분
								</Text>

								<Text
									style={{ fontSize: 18, fontWeight: "400" }}
								>
									{convertReward(searchedSurvey?.reward)}
								</Text>
								<Spacer size={10} />
								{searchedSurvey?.genres &&
								searchedSurvey?.genres.length !== 0 ? (
									<View
										style={{
											marginLeft: 8,
											flexDirection: "row",
										}}
									>
										{searchedSurvey.genres.map((genre) => (
											<GenreBox
												name={genre.name}
												key={genre.name}
											/>
										))}
									</View>
								) : (
									<View
										style={{
											marginLeft: 8,
											flexDirection: "row",
										}}
									>
										<GenreBox name="일반" />
									</View>
								)}
							</View>
						</View>
						<BottomButtonContainer
							rightTitle={confirmText}
							leftAction={() => {
								onClose();
							}}
							rightAction={() => {
								// navigation 이 없는데?
								onSecondSelection();
								onClose();
							}}
						/>
						{/* </View> */}
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
