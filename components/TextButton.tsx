import React from "react";
import {
    Text,
    TouchableOpacity,
    ViewStyle,
    StyleProp,
    StyleSheet,
    TextStyle,
} from "react-native";

interface TextButtonProps {
    title: string;
    onPress: () => void;
    textStyle?: StyleProp<TextStyle>;
    backgroundStyle?: StyleProp<ViewStyle>;
}

const TextButton: React.FC<TextButtonProps> = ({
    title,
    onPress,
    textStyle,
    backgroundStyle,
}) => {
    return (
        <TouchableOpacity
            style={[styles.container, backgroundStyle]}
            onPress={onPress}
        >
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
    },
    text: { textAlign: "center" },
});

export default TextButton;
