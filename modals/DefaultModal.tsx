import { Modal, StyleSheet, View, Text } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { colors } from "../utils/colors";
import { fontSizes } from "../utils/sizes";
import { Dimensions } from "react-native";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
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
	onClose,
}) => {
	return (
		<Modal transparent={true} visible={isModalVisible}>
			<View>
				<View style={[styles.modalContainer]}>
					<View style={styles.modalContent}>
						{/* Title, Description */}
						<View style={{ marginTop: 30, alignItems: "center" }}>
							<Text style={{ fontSize: 22, fontWeight: "800" }}>
								{title}
							</Text>
							<Spacer size={12} />
							<Text style={{ fontSize: 18, fontWeight: "500" }}>
								{description}
							</Text>
						</View>

						<View
							style={{
								flexDirection: "column",
								height: 120,
								alignSelf: "stretch",
								marginBottom: 10,
								marginHorizontal: 10,
							}}
						>
							<TextButton
								title={firstSelectionText}
								onPress={() => {
									onFirstSelection();
								}}
								backgroundStyle={{
									flex: 0.5,
									backgroundColor: "yellow",
									margin: 6,
									borderRadius: 6,
								}}
							/>
							<TextButton
								title={secondSelectionText}
								onPress={() => {
									onSecondSelection();
								}}
								backgroundStyle={{
									backgroundColor: "white",
									flex: 0.5,
									margin: 6,
									borderRadius: 6,
								}}
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
		borderColor: "black",
		borderRadius: 20,
		overflow: "hidden",
		justifyContent: "center",
	},
	modalContent: {
		height: 240,
		marginHorizontal: 40,
		backgroundColor: colors.background,
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
		backgroundColor: "white",
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
