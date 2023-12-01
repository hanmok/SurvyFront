import React from "react";
import { Question } from "../../interfaces/Question";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import ImageButton from "../ImageButton";
import { colors } from "../../utils/colors";
import {
    QuestionTypeKorean,
    QuestionTypeId,
    getQuestionType,
    // getQuestionTypeIndex,
} from "../../QuestionType";
import { fontSizes } from "../../utils/sizes";
import { Feather } from "@expo/vector-icons";
import { SelectionImage } from "../common/ImageNameType";

// Question 을 받도록, 전체가 버튼.

interface QuestionButtonProps {
    question: Question;
    onPress?: () => void;
}

const PostingQuestionBox: React.FC<QuestionButtonProps> = ({
    question,
    onPress,
}) => {
    // const questionTypeIndex = getQuestionTypeIndex(question.questionType);

    return (
        <TouchableOpacity style={styles.questionContainer} onPress={onPress}>
            {/* <Text style={{ fontSize: fontSizes.m20, paddingLeft: 10 }}> */}
            <Text style={{ fontSize: fontSizes.m20, paddingLeft: 4 }}>
                {question.position + 1}. {question.text}
            </Text>
            <View style={{ height: 10 }} />

            {question.selectableOptions.map(option => (
                <>
                    {(() => {
                        switch (question.questionTypeId) {
                            case QuestionTypeId.SingleSelection:
                                return (
                                    <View
                                        style={styles.rowContainer}
                                        key={option.id}
                                    >
                                        <Feather
                                            name={
                                                SelectionImage.unselectedSingleSelection
                                            }
                                            size={20}
                                            color="black"
                                        />
                                        <View style={{ width: 10 }}></View>
                                        <Text>{option.value}</Text>
                                    </View>
                                );
                            case QuestionTypeId.MultipleSelection:
                                return (
                                    <View
                                        style={styles.rowContainer}
                                        key={option.id}
                                    >
                                        <Feather
                                            name={
                                                SelectionImage.unselectedMultipleSelection
                                            }
                                            size={20}
                                            color="black"
                                        />
                                        <View style={{ width: 10 }}></View>
                                        <Text>{option.value}</Text>
                                    </View>
                                );
                            case QuestionTypeId.Essay:
                                return (
                                    <View key={option.id}>
                                        <Text
                                            style={{
                                                marginHorizontal: 8,
                                                color: colors.gray3,
                                            }}
                                        >
                                            {option.value}
                                        </Text>
                                        <View
                                            style={{
                                                flex: 1,
                                                marginTop: 5,
                                                marginLeft: 10,
                                                marginRight: 20,
                                                height: 1,
                                            }}
                                        ></View>
                                    </View>
                                );
                        }
                    })()}
                </>
            ))}
        </TouchableOpacity>
    );
};

export default PostingQuestionBox;

const styles = StyleSheet.create({
    questionContainer: {
        padding: 10,
        paddingLeft: 20,
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: colors.gray4,
        borderWidth: 1,
        overflow: "hidden",
    },
    questionWithIndex: {
        flexDirection: "row",
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 7,
        height: 20,
    },
});
