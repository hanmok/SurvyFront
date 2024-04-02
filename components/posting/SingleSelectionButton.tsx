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

    selectedTextStyle?: StyleProp<TextStyle>;
    selectedBackgroundStyle?: StyleProp<ViewStyle>;

    unselectedTextStyle?: StyleProp<TextStyle>;
    unselectedBackgroundStyle?: StyleProp<ViewStyle>;
    selectedIndex: number;
    index: number;
}

const SingleSelectionButton: React.FC<SingleSelectionButtonProps> = ({
    title,
    onPress,
    textStyle,
    backgroundStyle,
    unselectedBackgroundStyle,
    unselectedTextStyle,
    selectedBackgroundStyle,
    selectedTextStyle,
    selectedIndex,
    index,
}) => {
    return (
        <TouchableOpacity
            style={
                selectedIndex === index
                    ? [
                          styles.container,
                          backgroundStyle,
                          selectedBackgroundStyle,
                      ]
                    : [
                          styles.container,
                          backgroundStyle,
                          unselectedBackgroundStyle,
                      ]
            }
            onPress={onPress}
        >
            <Text
                style={
                    selectedIndex === index
                        ? [textStyle, selectedTextStyle]
                        : [textStyle, unselectedTextStyle]
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
