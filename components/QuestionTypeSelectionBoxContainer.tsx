import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import QuestionTypeSelectionBox from "./QuestionTypeSelectionBox";
import { QuestionTypeId, getQuestionType } from "../QuestionType";
// import { QuestionTypeIdEnum } from "../enums/QuestionTypeEnum";
// import { QuestionTypeId } from "../QuestionType";

interface QuestionTypeSelectionContainerProps {
    preselectedIndex?: number;
    handleSelect?: (questionTypeId: QuestionTypeId) => void;
}

const QuestionTypeSelectionBoxContainer: React.FC<
    QuestionTypeSelectionContainerProps
> = ({ preselectedIndex, handleSelect }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
        preselectedIndex !== undefined ? preselectedIndex : undefined
    );

    const singleSelectionId = QuestionTypeId.SingleSelection;
    const multipleSelectionId = QuestionTypeId.MultipleSelection;
    const essayId = QuestionTypeId.Essay;

    useEffect(() => {
        console.log(`selectedIndex: ${preselectedIndex}`);
        setSelectedIndex(preselectedIndex);
    }, [preselectedIndex]);

    return (
        <View style={styles.container}>
            <QuestionTypeSelectionBox
                index={singleSelectionId}
                isSelected={selectedIndex === singleSelectionId}
                onPress={() => {
                    setSelectedIndex(singleSelectionId);
                    handleSelect(QuestionTypeId.SingleSelection);
                }}
            />
            <QuestionTypeSelectionBox
                index={multipleSelectionId}
                isSelected={selectedIndex === multipleSelectionId}
                onPress={() => {
                    setSelectedIndex(multipleSelectionId);
                    handleSelect(QuestionTypeId.MultipleSelection);
                }}
            />
            <QuestionTypeSelectionBox
                index={essayId}
                isSelected={selectedIndex === essayId}
                onPress={() => {
                    setSelectedIndex(essayId);
                    handleSelect(QuestionTypeId.Essay);
                }}
            />
        </View>
    );
};

export default QuestionTypeSelectionBoxContainer;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        height: 50,
    },
});
