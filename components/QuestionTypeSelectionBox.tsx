import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import TextButton from "./TextButton";
import { QuestionType, getQuestionType } from "../QuestionType";
import { colors } from "../utils/colors";
import { borderSizes } from "../utils/sizes";

interface QuestionTypeProps {
    index: number;
    isSelected: boolean;
    onPress?: () => void;
}

// 하나의 버튼
const QuestionTypeSelectionBox: React.FC<QuestionTypeProps> = ({
    index,
    isSelected,
    onPress,
}) => {
    useEffect(() => {}, [isSelected]);

    const name = getQuestionType(index);

    return (
        <TextButton
            // onPress={() => onPress}
            onPress={onPress}
            // title={name}
            title={name}
            // onPress={toggleSelection}
            textStyle={
                isSelected
                    ? [styles.commonText, styles.selectedText]
                    : [styles.commonText, styles.unselectedText]
            }
            backgroundStyle={
                isSelected
                    ? [styles.commonBackground, styles.selectedBackground]
                    : [styles.commonBackground, styles.unselectedBackground]
            }
        />
    );
};

export default QuestionTypeSelectionBox;

const styles = StyleSheet.create({
    commonBackground: {
        borderRadius: borderSizes.m10,
        overflow: "hidden",
        width: 80,
        marginVertical: 10,
    },
    commonText: {
        textAlign: "center",
    },
    selectedBackground: { backgroundColor: colors.selectedQuestionBoxBG },
    selectedText: { color: colors.white },

    unselectedBackground: { backgroundColor: colors.unselectedQuestionBoxBG },
    unselectedText: { color: colors.unselectedQuestionBoxText },
});
