import { View, StyleSheet, FlatList, Text } from "react-native";
import { fontSizes } from "../utils/sizes";
import { SelectableOption } from "../interfaces/SelectableOption";
// import { Answer, GQLAnswer } from "../interfaces/Answer";
import { GQLAnswer, GQLSelectableOption } from "../interfaces/GQLInterface";
import { useState } from "react";
import { QuestionTypeEnum } from "../enums/QuestionTypeEnum";

/** questionTitle, selectableOptions, answers */
export interface QuestionResponseContainerProps {
    questionTitle: string;
    selectableOptions: GQLSelectableOption[];
    // answers: Answer[];
    questionType: QuestionTypeEnum;
    answers: GQLAnswer[];
}

const QuestionResponseContainer: React.FC<QuestionResponseContainerProps> = ({
    questionTitle,
    questionType,
    selectableOptions,
    answers,
}) => {
    const getNumberOfSameAnswer = (
        sos: GQLSelectableOption,
        anss: GQLAnswer[]
    ) => {
        return anss.filter(ans => ans.selectableOption.id === sos.id).length;
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: fontSizes.l24 }}>{questionTitle}</Text>
            <Text>Type: {questionType}</Text>
            <FlatList
                data={selectableOptions}
                renderItem={({ item }) => (
                    <View>
                        <Text>
                            {item.value} -{" "}
                            {getNumberOfSameAnswer(item, answers)} 명
                        </Text>
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
    },
});
