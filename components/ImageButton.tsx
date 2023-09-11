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
    // source,
    img,
    onPress,
    imageStyle,
    backgroundStyle,
    size,
}) => {
    // const uri = `asset:/assets/${source}`; // 이미지 파일의 절대 경로

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

export default ImageButton;
