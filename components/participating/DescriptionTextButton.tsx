import React from "react";
import {
    Text,
    TouchableOpacity,
    ViewStyle,
    StyleProp,
    StyleSheet,
    TextStyle,
} from "react-native";

interface DescriptionTextButtonProps {
    title: string;
    description: string;
    onPress: () => void;
    titleStyle?: StyleProp<TextStyle>;
    descriptionStyle?: StyleProp<TextStyle>;
    backgroundStyle?: StyleProp<ViewStyle>;
}

const DescriptionTextButton: React.FC<DescriptionTextButtonProps> = ({
    title,
    description,
    onPress,
    titleStyle,
    descriptionStyle,
    backgroundStyle,
}) => {
    return (
        <TouchableOpacity
            style={[styles.container, styles.shadow, backgroundStyle]}
            onPress={onPress}
        >
            <Text style={titleStyle}>{title}</Text>
            <Text style={descriptionStyle}>{description}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
    },
    text: {},
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

export default DescriptionTextButton;
