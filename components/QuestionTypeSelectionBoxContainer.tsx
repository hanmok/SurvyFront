import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import QuestionTypeSelectionBox from "./QuestionTypeSelectionBox";

// 어떤 버튼이 눌렸는지, 하나만 갖고 있을 것
const QuestionTypeSelectionBoxContainer = ({}) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(undefined);

    return (
        <View style={styles.container}>
            <QuestionTypeSelectionBox
                index={0}
                isSelected={selectedIndex === 0}
                onPress={() => setSelectedIndex(0)}
            />
            <QuestionTypeSelectionBox
                index={1}
                isSelected={selectedIndex === 1}
                onPress={() => setSelectedIndex(1)}
            />
            <QuestionTypeSelectionBox
                index={2}
                isSelected={selectedIndex === 2}
                onPress={() => setSelectedIndex(2)}
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
