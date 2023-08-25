import React from "react";
import { View, Text, TextInput, Button, Image, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { fontSizes, marginSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import Spacer from "../components/Spacer";
import TextButton from "../components/TextButton";
import ImageButton from "../components/ImageButton";
import PostingQuestionBox from "../components/PostingQuestionBox";
import { useState } from "react";
export default function SurveyRequestScreen() {
    const [customViews, setCustomViews] = useState([]);

    const handleAddCustomView = inputValue => {
        setCustomViews(prevViews => [...prevViews, inputValue]);
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <TextInput
                placeholder="설문 제목을 입력해주세요"
                style={styles.surveyTitle}
            />
            <View style={styles.moduleContainer}>
                <TextButton
                    backgroundStyle={styles.selectionButtonBG}
                    textStyle={styles.selectionButtonText}
                    title="타겟층"
                />
                <Text>Targets</Text>
            </View>

            {/* Genre Module */}
            <View style={styles.moduleContainer}>
                <TextButton
                    backgroundStyle={styles.selectionButtonBG}
                    textStyle={styles.selectionButtonText}
                    title="관심사"
                />
                <Text>Genres</Text>
            </View>

            {/* Questions To Make. List 로 만들 것. */}

            <ScrollView style={styles.questionList}>
                <Text>hi</Text>
                <Text>hi</Text>
                <Text>hi</Text>
                <Text>hi</Text>
                <Text>hi</Text>
                <Text>hi</Text>
                <PostingQuestionBox index={customViews.length + 1} question />
            </ScrollView>
            <ImageButton
                img={require("../assets/plus.jpg")}
                imageStyle={styles.plusButtonText}
                backgroundStyle={styles.plusButtonBG}
                // size={30} // 왜 사이즈가 안변하냐 ?
                height={80}
            />

            {/* <PostingQuestionBox/></PostingQuestionBox> */}

            <Text style={styles.expectedTime}>예상 소요시간 2분</Text>

            <TextButton
                textStyle={styles.requestText}
                backgroundStyle={styles.requestButtonBG}
                title="설문 요청하기"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: colors.background,
    },
    surveyTitle: {
        borderColor: colors.deepMainColor,
        borderWidth: 5,
        borderRadius: 10,
        marginHorizontal: marginSizes.m16,
        height: 50,
        marginTop: marginSizes.l20,
        marginBottom: marginSizes.s12,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },

    addButton: {
        backgroundColor: "black",
        color: "white",
    },
    moduleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: marginSizes.m16,
    },
    selectionButtonBG: {
        backgroundColor: colors.blurredGray,
        width: 60,
        fontWeight: "bold",
        justifyContent: "center",
        height: 30,
        borderRadius: 10,
        overflow: "hidden",
        marginHorizontal: 10,
    },
    selectionButtonText: {
        color: colors.buttonBlue,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },

    questionList: {
        marginHorizontal: marginSizes.l20,
        flexGrow: 1,
        marginVertical: marginSizes.m16,
    },

    plusButtonBG: {
        backgroundColor: colors.deepMainColor,
        marginHorizontal: marginSizes.l20,
        marginBottom: marginSizes.xl24,
        borderRadius: 12,
        overflow: "hidden",
        justifyContent: "center",
        height: 50,
    },
    plusButtonText: {
        color: colors.white,
        textAlign: "center",
        fontSize: 60,
        fontWeight: "bold",
        borderRadius: 40,
    },

    expectedTime: {
        flexBasis: 24,
        height: 24,
        marginRight: marginSizes.l20,
        textAlign: "right",
    },

    requestButtonBG: {
        marginHorizontal: marginSizes.l20,
        backgroundColor: colors.deepMainColor,
        color: colors.white,
        borderRadius: 10,
        padding: 10,
        backgroundColor: colors.inactiveBtnBG,
        marginBottom: 12,
    },
    requestText: {
        color: colors.white,
        textAlign: "center",
        fontSize: 20,
    },
});
