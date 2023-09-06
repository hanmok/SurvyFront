import React from "react";
import { Question } from "../../interfaces/Question";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Touchable,
} from "react-native";
import ImageButton from "../ImageButton";
import { colors } from "../../utils/colors";
import QuestionTypeSelectionBoxContainer from "../QuestionTypeSelectionBoxContainer";
import { getQuestionType, getQuestionTypeIndex } from "../../QuestionType";
import { fontSizes } from "../../utils/sizes";

// Question 을 받도록, 전체가 버튼.

interface QuestionButtonProps {
    question: Question;
    onPress?: () => void;
}

const PostingQuestionBoxButton: React.FC<QuestionButtonProps> = ({
    question,
    onPress,
}) => {
    const questionTypeIndex = getQuestionTypeIndex(question.questionType);

    return (
        <TouchableOpacity style={styles.questionContainer} onPress={onPress}>
            {/* <View style={styles.questionWithIndex}>
                <Text>{question.position + 1}. </Text>
                <Text>{question.text}</Text>
            </View> */}
            <Text style={{ fontSize: fontSizes.m20, paddingLeft: 10 }}>
                {question.position + 1}. {question.text}
            </Text>
            <View style={{ height: 10 }} />

            {question.selectableOptions.map(option => (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 7,
                        height: 20,
                    }}
                >
                    {questionTypeIndex === 0 ? (
                        <ImageButton
                            img={require("../../assets/unselectedSingleSelection.png")}
                        />
                    ) : (
                        <ImageButton
                            img={require("../../assets/unselectedMultipleSelection.png")}
                        />
                    )}
                    <View style={{ width: 10 }}></View>
                    <Text>{option.value}</Text>
                </View>
            ))}
        </TouchableOpacity>
    );
};

export default PostingQuestionBoxButton;

const styles = StyleSheet.create({
    questionContainer: {
        padding: 10,
        paddingLeft: 20,
        backgroundColor: colors.gray3,
        borderRadius: 10,
        overflow: "hidden",
    },
    questionWithIndex: {
        flexDirection: "row",
    },
});
