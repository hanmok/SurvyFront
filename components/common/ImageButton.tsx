import React from "react";
import {
	TouchableOpacity,
	ViewStyle,
	StyleProp,
	StyleSheet,
	Image,
	ImageStyle,
	ImageRequireSource,
} from "react-native";

interface ImageButtonProps {
	img: ImageRequireSource;
	onPress?: () => void;
	imageStyle?: StyleProp<ImageStyle>;
	backgroundStyle?: StyleProp<ViewStyle>;
	size?: number;
}

const ImageButton: React.FC<ImageButtonProps> = ({
	img,
	onPress,
	imageStyle,
	backgroundStyle,
	size,
}) => {
	return (
		<TouchableOpacity
			style={[styles.container, backgroundStyle]}
			onPress={onPress}
		>
			<Image
				source={img}
				style={[imageStyle, { aspectRatio: "1", height: size }]}
			/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
	},
});

export default React.memo(ImageButton);
