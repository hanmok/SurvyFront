import React, { useState } from "react";
import { View } from "react-native";
import QuestionTypeSelectionBox from "./QuestionTypeSelectionBox";

// 어떤 버튼이 눌렸는지, 하나만 갖고 있을 것
const QuestionTypeSelectionBoxContainer = ({}) => {
    const [selectedIndex, setSelectedIndex] = useState(5);

    return (
        <View
            style={{
                flexDirection: "row",
                // justifyContent: "space-around",
                justifyContent: "space-evenly",
                // backgroundColor: "yellow",
                height: 50,
            }}
        >
            <QuestionTypeSelectionBox index={0} />
            <QuestionTypeSelectionBox index={1} />
            <QuestionTypeSelectionBox index={2} />
            {/* <QuestionTypeSelectionBox index={3} /> */}
        </View>
    );
};

export default QuestionTypeSelectionBoxContainer;
