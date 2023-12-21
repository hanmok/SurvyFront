import { View, FlatList, StyleSheet, Text } from "react-native";
import { QuestionResponseContainerProps } from "./OverallSelectionResponseContainer";
import { getQuestionType } from "../../QuestionType";
import { fontSizes } from "../../utils/sizes";
import { useEffect, useState } from "react";
import { GQLAnswer, GQLSelectableOption } from "../../interfaces/GQLInterface";
import { logObject } from "../../utils/Log";
import { colors } from "../../utils/colors";

const IndivisualSelectionResponseContainer: React.FC<
    QuestionResponseContainerProps
> = ({
    questionTitle,
    questionTypeId,
    selectableOptions,
    answers,
    selectedUserId,
}) => {
    const [selectedSelectableOptions, setSelectedSelectableOptions] = useState<
        GQLSelectableOption[]
    >([]);

    const [selectedAnswers, setSelectedAnswers] = useState<GQLAnswer[]>([]);

    useEffect(() => {
        const anss = answers.filter(
            answer => answer.user.id === selectedUserId
        );

        logObject("\nall Answers flag 1", answers);
        logObject("anss", anss);
        // [{"id":"3074",
        // "question":{"id":"457214"},
        // "selectableOption":{"id":"469894","value":"기타"},
        // "user":{"id":"804"},
        // "answerText":"Ccc"}]

        const allSelectableOptionIds = anss.map(ans => ans.selectableOption.id);
        logObject("selectableOptions", selectableOptions);
        // [{"id":"469884","position":0,"value":"S1q1so1","isExtra":0},
        // {"id":"469894","position":1,"value":"기타","isExtra":1}]

        const selectedOptionsOnly = selectableOptions.filter(so =>
            allSelectableOptionIds.includes(so.id)
        );

        setSelectedAnswers(anss);

        logObject("gqlSelectableOptions", selectedOptionsOnly);
        console.log("");

        // [{"id":"469894","position":1,"value":"기타","isExtra":1}]
        setSelectedSelectableOptions(selectedOptionsOnly);
    }, [selectedUserId]);

    return (
        <View>
            <View style={styles.whole}>
                <Text style={styles.questionType}>
                    {getQuestionType(parseInt(questionTypeId))}
                </Text>
            </View>
            <View style={styles.container}>
                <Text style={{ fontSize: fontSizes.l24 }}>{questionTitle}</Text>
                <View style={{ height: 10 }} />
                <FlatList
                    data={selectedAnswers}
                    renderItem={({ item }) => (
                        <Text>
                            {item.answerText !== ""
                                ? item.answerText
                                : item.selectableOption.value}
                        </Text>
                    )}
                    keyExtractor={item => `${item.id}`}
                    ListFooterComponent={<View style={{ height: 10 }} />}
                />
            </View>
        </View>
    );
};

export default IndivisualSelectionResponseContainer;

const styles = StyleSheet.create({
    whole: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        overflow: "hidden",
        borderColor: colors.white,
        alignSelf: "flex-end",
        marginRight: 10,
    },
    container: {
        borderRadius: 10,
        borderColor: colors.black,
        borderWidth: 1,
        overflow: "hidden",
        padding: 6,
    },
    questionType: {
        backgroundColor: colors.black,
        color: colors.white,
        paddingHorizontal: 10,
        paddingVertical: 4,
        fontWeight: "bold",
    },
});
