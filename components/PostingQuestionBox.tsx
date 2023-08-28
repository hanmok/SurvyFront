import React, { useState } from "react";

import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../utils/colors";
import QuestionTypeSelectionBox from "./QuestionTypeSelectionBox";
import QuestionTypeSelectionBoxContainer from "./QuestionTypeSelectionBoxContainer";
import { boxSizes } from "../utils/sizes";
import { borderSizes } from "../utils/sizes";
interface PostingQuestionProps {
    index: number;
    // question: string;
    // questionTypeIndex: number;
    // selectableOptionsText: number;
}

const PostingQuestionBox: React.FC<PostingQuestionProps> = ({
    index,
    // question,
    // questionTypeIndex,
    // selectableOptionsText,
}) => {
    const [title, setTitle] = useState("");

    return (
        <>
            <View style={styles.questionContainer}>
                <View style={styles.questionTextContainer}>
                    <Text style={styles.indexStyle}>{index}.</Text>
                    <TextInput
                        multiline
                        style={styles.question}
                        placeholder="질문을 입력해주세요"
                        onChangeText={setTitle}
                        value={title}
                    />
                </View>
                {/* Question Type Selection Box */}
                {/* <QuestionTypeSelectionBox index={undefined} /> */}
                <QuestionTypeSelectionBoxContainer />
                <View style={{ height: 60 }}></View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    questionContainer: {
        backgroundColor: colors.surveyBoxBackground,
        borderRadius: borderSizes.m10,
        overflow: "hidden",
        height: boxSizes.requestingQuestionContainer,
    },
    questionTextContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    indexStyle: {
        marginLeft: 10,
        // margintop: 10,
        color: colors.gray2,
        fontSize: 16,
    },
    question: {
        marginLeft: 10,
        fontSize: 16,
    },
});

export default PostingQuestionBox;
