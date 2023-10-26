import { View, StyleSheet, FlatList, Text } from "react-native";
import { fontSizes } from "../../utils/sizes";
import { SelectableOption } from "../../interfaces/SelectableOption";
// import { Answer, GQLAnswer } from "../interfaces/Answer";
import { GQLAnswer, GQLSelectableOption } from "../../interfaces/GQLInterface";
import { useState } from "react";
import {
    QuestionTypeEnum,
    convertIdToType,
} from "../../enums/QuestionTypeEnum";
import { screenWidth } from "../../utils/ScreenSize";
import { colors } from "../../utils/colors";
import { getQuestionType } from "../../QuestionType";
import { QuestionResponseContainerProps } from "./OverallSelectionResponseContainer";
/** questionTitle, selectableOptions, answers */

// 이거.. 나눠야 하는거 아닐까?
const OverallEssayResponseContainer: React.FC<
    QuestionResponseContainerProps
> = ({
    questionTitle,
    questionTypeId, // 어차피 300
    answers,
}) => {
    const getNumberOfSameAnswer = (
        sos: GQLSelectableOption, // selectable Options
        anss: GQLAnswer[]
    ) => {
        return anss.filter(ans => ans.selectableOption.id === sos.id).length;
    };

    const totalNumberOfAnswer = answers.length;
    const wholeLength = screenWidth - 100;

    const getPercentage = (num: number) =>
        num > 0 ? ` (${(num * 100).toFixed(1)} %) ` : "";

    const applyMinimumLength = (len: number) => {
        return len > 0 ? len : 100;
    };

    return (
        <View>
            <View style={styles.whole}>
                <Text style={styles.questionType}>
                    {getQuestionType(parseInt(questionTypeId))}
                </Text>
            </View>
            <View style={styles.container}>
                <Text style={{ fontSize: fontSizes.l24 }}>{questionTitle}</Text>
                <View style={{ height: 20 }} />
                <FlatList
                    data={answers}
                    renderItem={({ item }) => (
                        <View>
                            <Text style={{ marginLeft: 10, marginBottom: 10 }}>
                                {item.answerText}
                            </Text>
                        </View>
                    )}
                    keyExtractor={item => `${item.id}`}
                />
            </View>
        </View>
    );
};

export default OverallEssayResponseContainer;

const styles = StyleSheet.create({
    whole: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        overflow: "hidden",
        borderColor: "white",
        alignSelf: "flex-end",
        marginRight: 10,
    },
    container: {
        borderRadius: 10,
        borderColor: "black",
        borderWidth: 1,
        overflow: "hidden",
        padding: 6,
        // backgroundColor: "magenta",
    },
    bar: {
        height: 30,

        marginBottom: 10,
        justifyContent: "center",
        marginLeft: 10,
        marginTop: 4,
    },
    questionType: {
        backgroundColor: "black",
        color: "white",
        paddingHorizontal: 10,
        paddingVertical: 4,
        fontWeight: "bold",
    },
});
