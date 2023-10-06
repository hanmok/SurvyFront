import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import QuestionTypeSelectionBox from "./QuestionTypeSelectionBox";
import { QuestionTypeId, getQuestionType } from "../QuestionType";

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

    useEffect(() => {
        console.log(`selectedIndex: ${preselectedIndex}`);
        setSelectedIndex(preselectedIndex);
    }, [preselectedIndex]);

    return (
        <View style={styles.container}>
            <QuestionTypeSelectionBox
                index={100}
                isSelected={selectedIndex === 100}
                onPress={() => {
                    setSelectedIndex(100);
                    handleSelect(QuestionTypeId.SingleSelection);
                }}
            />
            <QuestionTypeSelectionBox
                index={200}
                isSelected={selectedIndex === 200}
                onPress={() => {
                    setSelectedIndex(200);
                    handleSelect(QuestionTypeId.MultipleSelection);
                }}
            />
            <QuestionTypeSelectionBox
                index={300}
                isSelected={selectedIndex === 300}
                onPress={() => {
                    setSelectedIndex(300);
                    handleSelect(QuestionTypeId.Essay);
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
