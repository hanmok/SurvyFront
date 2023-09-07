import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import QuestionTypeSelectionBox from "./QuestionTypeSelectionBox";
import { QuestionType, getQuestionType } from "../QuestionType";

interface QuestionTypeSelectionContainerProps {
    preselectedIndex?: number;
    handleSelect?: (questionType: QuestionType) => void;
}

const QuestionTypeSelectionBoxContainer: React.FC<
    QuestionTypeSelectionContainerProps
> = ({ preselectedIndex, handleSelect }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
        preselectedIndex !== undefined ? preselectedIndex : undefined
    );

    useEffect(() => {
        console.log(`selectedIndex: ${preselectedIndex}`);
        setSelectedIndex(preselectedIndex);
    }, [preselectedIndex]);

    return (
        <View style={styles.container}>
            <QuestionTypeSelectionBox
                index={0}
                isSelected={selectedIndex === 0}
                onPress={() => {
                    setSelectedIndex(0);
                    handleSelect(QuestionType.SingleSelection);
                }}
            />
            <QuestionTypeSelectionBox
                index={1}
                isSelected={selectedIndex === 1}
                onPress={() => {
                    setSelectedIndex(1);
                    handleSelect(QuestionType.MultiSelection);
                }}
            />
            <QuestionTypeSelectionBox
                index={2}
                isSelected={selectedIndex === 2}
                onPress={() => {
                    setSelectedIndex(2);
                    handleSelect(QuestionType.Essay);
                }}
            />
            {/* <QuestionTypeSelectionBox index={3} /> */}
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
