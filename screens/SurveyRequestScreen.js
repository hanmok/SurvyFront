import React from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    TouchableOpacity,
    Touchable,
} from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { fontSizes, paddingSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SurveyRequestScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                placeholder="설문 제목을 입력해주세요"
                style={styles.surveyTitle}
            />

            <TouchableOpacity style={styles.selectionButtonBG}>
                <Text style={styles.selectionButtonText}>타겟층</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.selectionButtonBG}>
                <Text style={styles.selectionButtonText}>관심사</Text>
            </TouchableOpacity>

            <View style={styles.questionList}></View>

            <TouchableOpacity style={styles.plusButtonBG}>
                <Text style={styles.plusButtonText}>+</Text>
            </TouchableOpacity>

            <Text style={styles.expectedTime}>예상 소요시간 1분</Text>

            <TouchableOpacity style={styles.requestButtonBG}>
                <Text style={styles.requestText}>설문 요청하기</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    surveyTitle: {
        borderColor: colors.deepMainColor,
        borderWidth: 5,
        borderRadius: 10,
        paddingHorizontal: paddingSizes.m16,
        height: 50,
    },

    questionList: {
        // flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexGrow: 1,
        backgroundColor: colors.lightMainColor,
    },
    addButton: {
        backgroundColor: "black",
        color: "white",
    },
    selectionButtonBG: {
        backgroundColor: colors.blurredGray,
        // backgroundColor: "#000",
        fontWeight: "bold",
        paddingVertical: paddingSizes.xs8,
        paddingHorizontal: paddingSizes.s12,
        height: 50,
    },
    selectionButtonText: {
        color: colors.buttonBlue,
        textAlign: "center",
    },
    expectedTime: {
        // width: 100,
        flexBasis: 24,
        height: 24,
        paddingBottom: 6,
        paddingRight: 12,
        textAlign: "right",
    },

    plusButtonText: {
        color: colors.white,
        textAlign: "center",
        fontSize: 60,
        fontWeight: "bold",
    },
    plusButtonBG: {
        backgroundColor: colors.deepMainColor,
        height: 60,
        alignItems: "center",
    },

    requestButtonBG: {
        paddingHorizontal: paddingSizes.l20,
        backgroundColor: colors.deepMainColor,
        color: colors.white,
        borderRadius: 10,
    },
    requestText: {
        color: colors.white,
        textAlign: "center",
        fontSize: 30,
    },
});
