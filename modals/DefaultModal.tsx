import { Modal, StyleSheet, View, Text } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { colors } from "../utils/colors";
import { fontSizes } from "../utils/sizes";
import { screenHeight, screenWidth } from "../utils/ScreenSize";
import TextButton from "../components/TextButton";
import Spacer from "../components/common/Spacer";

interface DefaultModalProps {
	onFirstSelection: () => void;
	firstSelectionText: string;

	onSecondSelection: () => void;
	secondSelectionText: string;

	onClose: () => void;

	title: string;
	description: string;
	isModalVisible: boolean;
}

export const DefaultModal: React.FC<DefaultModalProps> = ({
	onFirstSelection,
	onSecondSelection,
	title,
	description,
	isModalVisible,
	secondSelectionText,
	firstSelectionText,
}) => {
	return (
		<Modal transparent={true} visible={isModalVisible}>
			<View>
				<View style={[styles.modalContainer]}>
					<View style={styles.modalContent}>
						{/* Title, Description */}
						<View style={{ marginTop: 30, alignItems: "center" }}>
							<Text style={styles.titleText}>{title}</Text>
							<Spacer size={12} />
							<Text style={styles.descriptionText}>
								{description}
							</Text>
						</View>

						<View style={styles.buttonsContainer}>
							<TextButton
								title={firstSelectionText}
								onPress={() => {
									onFirstSelection();
								}}
								// backgroundStyle={styles.buttonBG}
								backgroundStyle={styles.firstButtonBG}
								textStyle={{ color: "white" }}
							/>
							<TextButton
								title={secondSelectionText}
								onPress={() => {
									onSecondSelection();
								}}
								backgroundStyle={styles.buttonBG}
							/>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		width: screenWidth,
		height: screenHeight,
		backgroundColor: "rgba(0, 0, 0, 0.85)",
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
	titleText: { fontSize: 22, fontWeight: "800" },
	descriptionText: { fontSize: 18, fontWeight: "500" },
	buttonsContainer: {
		flexDirection: "column",
		height: 120,
		alignSelf: "stretch",
		marginBottom: 10,
		marginHorizontal: 10,
	},
	buttonBG: {
		backgroundColor: colors.white,
		flex: 0.5,
		margin: 6,
		borderRadius: 6,
	},
	firstButtonBG: {
		backgroundColor: colors.deeperMainColor,
		flex: 0.5,
		margin: 6,
		borderRadius: 6,
	},
});
