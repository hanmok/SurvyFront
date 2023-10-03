import React, { useState } from "react";
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

const SelectableTextButton: React.FC<TextButtonProps> = ({
    title,
    onPress,
    textStyle,
    backgroundStyle,
}) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleSelection = () => {
        setIsSelected(!isSelected);
        onPress();
    };

    return (
        <TouchableOpacity
            // style={[styles.container, backgroundStyle]}
            style={
                isSelected
                    ? [
                          styles.container,
                          backgroundStyle,
                          { backgroundColor: "magenta" },
                      ]
                    : [
                          styles.container,
                          backgroundStyle,
                          { backgroundColor: "white" },
                      ]
            }
            onPress={handleSelection}
        >
            <Text
                style={
                    isSelected
                        ? [textStyle, { color: "white" }]
                        : [textStyle, { color: "black" }]
                }
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
    },
});

export default SelectableTextButton;
