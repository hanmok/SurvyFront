import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { fontSizes } from "../utils/sizes";

interface SelectableOptionProps {
    id: number;
    questionId: number;
    position: number;
    value: string;
    questionType: string;
}

const SelectableOptionBox: React.FC<SelectableOptionProps> = ({
    id,
    questionId,
    position,
    value,
    questionType,
}) => {
    return (
        <View style={styles.container}>
            {questionType === "SINGLE_SELECTION" ? (
                <Text>Single</Text>
            ) : (
                <Text>Multi</Text>
            )}
            <Text style={styles.textStyle}>
                {position}. {value}
            </Text>
        </View>
    );
};

export default SelectableOptionBox;

const styles = StyleSheet.create({
    container: {
        paddingLeft: 16,
    },
    textStyle: {
        fontSize: fontSizes.s16,
    },
});
