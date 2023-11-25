import { View, StyleSheet, FlatList, Text } from "react-native";
import { fontSizes } from "../../utils/sizes";
import { GQLAnswer, GQLSelectableOption } from "../../interfaces/GQLInterface";
import { screenWidth } from "../../utils/ScreenSize";
import { colors } from "../../utils/colors";
import { getQuestionType } from "../../QuestionType";

/** response, questionTitle, selectableOptions, answers, selectedUserId */
export interface QuestionResponseContainerProps {
    sectionSequence: number;
    questionTitle: string;
    selectableOptions: GQLSelectableOption[];
    questionTypeId: string;
    answers: GQLAnswer[];
    selectedUserId: number | undefined;
}

const OverallSelectionResponseContainer: React.FC<
    QuestionResponseContainerProps
> = ({ questionTitle, questionTypeId, selectableOptions, answers }) => {
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
                    data={selectableOptions}
                    renderItem={({ item }) => (
                        <View>
                            <Text style={{ marginLeft: 10 }}>{item.value}</Text>
                            <View
                                style={[
                                    {
                                        width: applyMinimumLength(
                                            (wholeLength *
                                                getNumberOfSameAnswer(
                                                    item,
                                                    answers
                                                )) /
                                                answers.length
                                        ),
                                        backgroundColor:
                                            getNumberOfSameAnswer(
                                                item,
                                                answers
                                            ) > 0
                                                ? colors.gray3
                                                : colors.transparent,
                                        borderRadius: 6,
                                    },

                                    styles.bar,
                                ]}
                            >
                                <Text style={{ marginLeft: 10 }}>
                                    {getNumberOfSameAnswer(item, answers)}
                                    {getPercentage(
                                        getNumberOfSameAnswer(item, answers) /
                                            totalNumberOfAnswer
                                    )}
                                </Text>
                            </View>
                        </View>
                    )}
                    keyExtractor={item => `${item.id}`}
                />
            </View>
        </View>
    );
};

export default OverallSelectionResponseContainer;

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
