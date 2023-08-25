import React, { useState } from "react";

import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../utils/colors";

interface PostingQuestionProps {
    index: number;
    question: string;
    questionTypeIndex: number;
    selectableOptionsText: number;
}

const PostingQuestionBox: React.FC<PostingQuestionProps> = ({
    index,
    question,
    questionTypeIndex,
    selectableOptionsText,
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

                <View
                    style={{ backgroundColor: colors.magenta, height: 50 }}
                ></View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    questionContainer: {
        backgroundColor: colors.surveyBoxBackground,
        borderRadius: 10,
        overflow: "hidden",
        height: 80,
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
