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
    isEnabled?: boolean;
    hasShadow?: boolean;
}

const TextButton: React.FC<TextButtonProps> = ({
    title,
    onPress,
    textStyle,
    backgroundStyle,
    isEnabled = true,
    hasShadow = true,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                backgroundStyle,
                hasShadow && styles.shadow,
            ]}
            onPress={onPress}
            disabled={!isEnabled}
            activeOpacity={!isEnabled ? 1 : 0.2}
        >
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 4,
        //     height: 4,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 2,
    },
    text: { textAlign: "center" },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2,
    },
});

export default TextButton;
