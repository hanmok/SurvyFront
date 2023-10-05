import React, { useState } from "react";
import {
    Text,
    TouchableOpacity,
    ViewStyle,
    StyleProp,
    StyleSheet,
    TextStyle,
} from "react-native";

interface SingleSelectionButtonProps {
    title: string;
    onPress: () => void;
    textStyle?: StyleProp<TextStyle>;
    backgroundStyle?: StyleProp<ViewStyle>;
    selectedTextColor: string;
    selectedBackgroundColor: string;
    unselectedTextColor: string;
    unselectedBackgroundColor: string;
    selectedIndex: number;
    index: number;
}

const SingleSelectionButton: React.FC<SingleSelectionButtonProps> = ({
    title,
    onPress,
    textStyle,
    backgroundStyle,
    selectedTextColor,
    selectedBackgroundColor,
    unselectedTextColor,
    unselectedBackgroundColor,
    selectedIndex,
    index,
}) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleSelection = () => {
        onPress();
    };

    return (
        <TouchableOpacity
            style={
                selectedIndex === index
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
            onPress={onPress}
        >
            <Text
                style={
                    selectedIndex === index
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

export default SingleSelectionButton;
