import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import TextButton from "./TextButton";
import { QuestionTypeKorean, getQuestionType } from "../QuestionType";
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
    const name = getQuestionType(index);

    return (
        <TextButton
            onPress={onPress}
            title={name}
            textStyle={
                isSelected
                    ? [styles.commonText, styles.selectedText]
                    : [styles.commonText, styles.unselectedText]
            }
            backgroundStyle={[
                styles.commonBackground,
                isSelected
                    ? styles.selectedBackground
                    : styles.unselectedBackground,
            ]}
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
    selectedBackground: { backgroundColor: "#5094FD" },
    selectedText: { color: colors.white, fontWeight: "700" },

    unselectedBackground: {
        backgroundColor: "#DCEAFF",
        borderWidth: 1,
        borderColor: colors.lightMainColor,
    },
    unselectedText: { color: "#777777" },
});
