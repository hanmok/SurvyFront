import { View, StyleSheet, Text } from "react-native";
import { fontSizes } from "../../utils/sizes";
import { useEffect, useState } from "react";

import { getQuestionType } from "../../QuestionType";
import { QuestionResponseContainerProps } from "./OverallSelectionResponseContainer";
import { log, logObject } from "../../utils/Log";

/** questionTitle, selectableOptions, answers */
const IndivisualEssayResponseContainer: React.FC<
    QuestionResponseContainerProps
> = ({ questionTitle, answers, selectedUserId }) => {
    const [oneAnswer, setOneAnswer] = useState<string>(undefined);

    useEffect(() => {
        log("\n");
        logObject("[IndivisualEssayResponseContainer] answers", answers);
        logObject(
            "[IndivisualEssayResponseContainer] passed userId: ",
            selectedUserId
        );
        const myAnswer = answers.find(ans => ans.user.id === selectedUserId);
        logObject(
            "[IndivisualEssayResponseContainer] filtered answer",
            myAnswer
        );
        if (myAnswer && myAnswer.answerText) {
            setOneAnswer(myAnswer.answerText);
        }
    }, [selectedUserId]);

    return (
        <View>
            <View style={styles.whole}>
                <Text style={styles.questionType}>{getQuestionType(300)}</Text>
            </View>
            <View style={styles.container}>
                <Text style={{ fontSize: fontSizes.l24 }}>{questionTitle}</Text>
                <View style={{ height: 10 }} />
                <Text>{oneAnswer}</Text>
            </View>
        </View>
    );
};

export default IndivisualEssayResponseContainer;

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
