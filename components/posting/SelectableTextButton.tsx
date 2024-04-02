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
    selectedTextColor: string;
    selectedBackgroundColor: string;
    unselectedTextColor: string;
    unselectedBackgroundColor: string;
}

const SelectableTextButton: React.FC<TextButtonProps> = ({
    title,
    onPress,
    textStyle,
    backgroundStyle,
    selectedTextColor,
    selectedBackgroundColor,
    unselectedTextColor,
    unselectedBackgroundColor,
}) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleSelection = () => {
        setIsSelected(!isSelected);
        onPress();
    };

    return (
        <TouchableOpacity
            style={
                isSelected
                    ? [
                          styles.container,
                          backgroundStyle,
                          { backgroundColor: selectedBackgroundColor },
                      ]
                    : [
                          styles.container,
                          backgroundStyle,
                          { backgroundColor: unselectedBackgroundColor },
                      ]
            }
            onPress={handleSelection}
        >
            <Text
                style={
                    isSelected
                        ? [textStyle, { color: selectedTextColor }]
                        : [textStyle, { color: unselectedTextColor }]
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
