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
            style={[styles.container, backgroundStyle]}
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
});

export default DescriptionTextButton;
