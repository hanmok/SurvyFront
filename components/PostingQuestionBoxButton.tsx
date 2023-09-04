import React from "react";
import { Question } from "../interfaces/Question";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Touchable,
} from "react-native";
// Question 을 받도록, 전체가 버튼.

interface QuestionButtonProps {
    question: Question;
    onPress?: () => void;
}

const PostingQuestionBoxButton: React.FC<QuestionButtonProps> = ({
    question,
    onPress,
}) => {
    return (
        <TouchableOpacity style={styles.questionContainer} onPress={onPress}>
            <View style={styles.questionWithIndex}>
                <Text>{question.position + 1}. </Text>
                <Text>{question.text}</Text>
            </View>
            {question.selectableOptions.map(option => (
                <Text>{option.value}</Text>
            ))}
        </TouchableOpacity>
    );
};

export default PostingQuestionBoxButton;

const styles = StyleSheet.create({
    questionContainer: {
        padding: 10,
        backgroundColor: "magenta",
        borderRadius: 10,
        overflow: "hidden",
    },
    questionWithIndex: {
        flexDirection: "row",
    },
});
