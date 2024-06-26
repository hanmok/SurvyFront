import React, { useState, useEffect } from "react";
import {
	Button,
	Modal,
	StyleSheet,
	View,
	Animated,
	Dimensions,
} from "react-native";
import Separator from "../components/common/Separator";
import { colors } from "../utils/colors";
import { TouchableNativeFeedback } from "react-native";
import TextButton from "../components/common/TextButton";

interface PostingMenuModalProps {
	isMenuModalVisible: boolean;
	onClose: () => void;
	onInitialize: () => void;
	onInitializeCurrent: () => void;
	onSave: () => void;
}

// const height = Dimensions.get
export const PostingMenuModal: React.FC<PostingMenuModalProps> = ({
	isMenuModalVisible,
	onClose,
	onInitialize,
	onInitializeCurrent,
	onSave,
}) => {
	const [fadeAnim] = useState(new Animated.Value(0));
	const [slideAnim] = useState(new Animated.Value(200));

	useEffect(() => {
		if (isMenuModalVisible) {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 300, // fade in 애니메이션 지속 시간
				useNativeDriver: true,
			}).start();

			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 300, // slide 애니메이션 지속 시간
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(slideAnim, {
				toValue: 100,
				duration: 300,
				useNativeDriver: true,
			}).start(() => {
				// Modal 사라질 때 Animation
				Animated.timing(fadeAnim, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}).start();
			});
		}
	}, [isMenuModalVisible]);

	return (
		<Modal
			transparent={true}
			visible={isMenuModalVisible}
			animationType="fade"
		>
			<TouchableNativeFeedback
				style={styles.wholeContainer}
				onPress={onClose}
			>
				<View style={styles.wholeContainer}>
					<Animated.View
						style={[
							styles.mainContainer,
							{
								opacity: fadeAnim,
								transform: [{ translateY: slideAnim }],
							},
						]}
					>
						<TextButton
							title={"전체 초기화"}
							onPress={() => {
								onInitialize();
								onClose();
							}}
							backgroundStyle={{
								height: 50,
							}}
							textStyle={styles.optionText}
							hasShadow={false}
						/>
						<Separator />
						<TextButton
							title={"현재 섹션 초기화"}
							onPress={() => {
								onInitializeCurrent();
								onClose();
							}}
							backgroundStyle={{
								height: 50,
							}}
							textStyle={styles.optionText}
							hasShadow={false}
						/>
						<Separator />
						<TextButton
							title={"저장"}
							onPress={() => {
								onSave();
								onClose();
							}}
							backgroundStyle={{
								height: 50,
							}}
							textStyle={styles.optionText}
							hasShadow={false}
						/>
					</Animated.View>
				</View>
			</TouchableNativeFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	wholeContainer: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: colors.modalBackground,
	},
	mainContainer: {
		backgroundColor: colors.white,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		paddingBottom: 50,
		paddingTop: 20,
		paddingHorizontal: 12,
	},
	optionText: {
		fontSize: 18,
		textAlign: "left",
		paddingLeft: 12,
	},
});
