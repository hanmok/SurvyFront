import { View, StyleSheet, FlatList, Text } from "react-native";
import { fontSizes } from "../../utils/sizes";
import { GQLAnswer, GQLSelectableOption } from "../../interfaces/GQLInterface";
import { screenWidth } from "../../utils/ScreenSize";
import { getQuestionType } from "../../QuestionType";
import { QuestionResponseContainerProps } from "./OverallSelectionResponseContainer";

const OverallEssayResponseContainer: React.FC<
    QuestionResponseContainerProps
> = ({
    questionTitle,
    questionTypeId, // 어차피 300
    answers,
}) => {
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
