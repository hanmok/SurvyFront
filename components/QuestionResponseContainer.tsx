import { View, StyleSheet, FlatList, Text } from "react-native";
import { fontSizes } from "../utils/sizes";
import { SelectableOption } from "../interfaces/SelectableOption";
// import { Answer, GQLAnswer } from "../interfaces/Answer";
import { GQLAnswer, GQLSelectableOption } from "../interfaces/GQLInterface";
import { useState } from "react";
import { QuestionTypeEnum } from "../enums/QuestionTypeEnum";
import { screenWidth } from "../utils/ScreenSize";
import { colors } from "../utils/colors";

/** questionTitle, selectableOptions, answers */
export interface QuestionResponseContainerProps {
    questionTitle: string;
    selectableOptions: GQLSelectableOption[];
    // answers: Answer[];
    // questionType: QuestionTypeEnum;
    answers: GQLAnswer[];
}

const QuestionResponseContainer: React.FC<QuestionResponseContainerProps> = ({
    questionTitle,
    // questionType,
    selectableOptions,
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
    const getPercentage = (num: number) => `${(num * 100).toFixed(1)} %`;
    // stick

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: fontSizes.l24 }}>{questionTitle}</Text>
            <View style={{ height: 20 }} />
            <FlatList
                data={selectableOptions}
                renderItem={({ item }) => (
                    <View>
                        <Text style={{ marginLeft: 10 }}>{item.value}</Text>

                        <View
                            style={{
                                width:
                                    (wholeLength *
                                        getNumberOfSameAnswer(item, answers)) /
                                    answers.length,
                                height: 30,
                                backgroundColor: colors.gray3,
                                marginBottom: 10,
                                justifyContent: "center",
                                marginLeft: 10,
                                marginTop: 4,
                            }}
                        >
                            <Text style={{ marginLeft: 10 }}>
                                {getNumberOfSameAnswer(item, answers)} (
                                {getPercentage(
                                    getNumberOfSameAnswer(item, answers) /
                                        totalNumberOfAnswer
                                )}
                                )
                            </Text>
                        </View>
                    </View>
                )}
                keyExtractor={item => `${item.id}`}
            />
        </View>
    );
};

export default QuestionResponseContainer;

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        borderColor: "black",
        borderWidth: 1,
        overflow: "hidden",
        padding: 6,
        // backgroundColor: "magenta",
    },
});
