import { View, StyleSheet, FlatList, Text } from "react-native";
import { fontSizes } from "../utils/sizes";
import { SelectableOption } from "../interfaces/SelectableOption";
import { Answer, GQLAnswer } from "../interfaces/Answer";
import { useState } from "react";

/** questionTitle, selectableOptions, answers */
export interface QuestionResponseContainerProps {
    questionTitle: string;
    selectableOptions: SelectableOption[];
    // answers: Answer[];
    answers: GQLAnswer[];
}

const QuestionResponseContainer: React.FC<QuestionResponseContainerProps> = ({
    questionTitle,
    selectableOptions,
    answers,
}) => {
    const getNumberOfSameAnswer = (
        sos: SelectableOption,
        anss: GQLAnswer[]
    ) => {
        return anss.filter(ans => ans.selectableOption.id === sos.id).length;
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: fontSizes.l24 }}>{questionTitle}</Text>
            <FlatList
                data={selectableOptions}
                renderItem={({ item }) => (
                    <View>
                        <Text>
                            {item.value} -{" "}
                            {getNumberOfSameAnswer(item, answers)}
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
