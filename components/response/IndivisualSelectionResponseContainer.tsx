import { View, FlatList, StyleSheet, Text } from "react-native";
import { QuestionResponseContainerProps } from "./OverallSelectionResponseContainer";
import { getQuestionType } from "../../QuestionType";
import { fontSizes } from "../../utils/sizes";
import { useEffect, useState } from "react";
import { GQLAnswer, GQLSelectableOption } from "../../interfaces/GQLInterface";
import { SelectableOption } from "../../interfaces/SelectableOption";
import { log, logObject } from "../../utils/Log";

const IndivisualSelectionResponseContainer: React.FC<
    QuestionResponseContainerProps
> = ({
    questionTitle,
    questionTypeId,
    selectableOptions,
    answers,
    selectedUserId,
}) => {
    const [selectedAnswers, setSelectedAnswers] = useState<GQLAnswer[]>([]);
    const [selectedSelectableOptions, setSelectedSelectableOptions] = useState<
        GQLSelectableOption[]
    >([]);

    useEffect(() => {
        logObject(
            "[IndivisualSelectionResponseContainer] passed answers: ",
            answers
        );
        log(
            "[IndivisualSelectionResponseContainer] passed userId: " +
                selectedUserId
        );
        const anss = answers.filter(
            answer => answer.user.id === selectedUserId
        );
        logObject(
            "[IndivisualSelectionResponseContainer] filtered answers",
            anss
        );
        setSelectedAnswers(anss);
        const allSelectableOptionIds = anss.map(ans => ans.selectableOption.id);

        const selectedOptionsOnly = selectableOptions.filter(so =>
            allSelectableOptionIds.includes(so.id)
        );
        setSelectedSelectableOptions(selectedOptionsOnly);
        logObject(
            "[IndivisualSelectionResponseContainer] selectedOptionsOnly:",
            selectedOptionsOnly
        );
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
                    data={selectedSelectableOptions}
                    renderItem={({ item }) => (
                        <Text style={{ marginLeft: 10 }}>{item.value}</Text>
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
        // backgroundColor: "magenta",
    },
    // bar: {
    //     height: 30,
    //     marginBottom: 10,
    //     justifyContent: "center",
    //     marginLeft: 10,
    //     marginTop: 4,
    // },
    questionType: {
        backgroundColor: "black",
        color: "white",
        paddingHorizontal: 10,
        paddingVertical: 4,
        fontWeight: "bold",
    },
});
