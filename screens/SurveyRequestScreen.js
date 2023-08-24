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
import { fontSizes, marginSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import Spacer from "../components/Spacer";

export default function SurveyRequestScreen() {
    return (
        // <SafeAreaView style={styles.container} edges={["top"]}>
        <SafeAreaView style={styles.container} edges={[]}>
            <TextInput
                placeholder="설문 제목을 입력해주세요"
                style={styles.surveyTitle}
            />
            <View style={styles.moduleContainer}>
                <TouchableOpacity style={styles.selectionButtonBG}>
                    <Text style={styles.selectionButtonText}>타겟층</Text>
                </TouchableOpacity>
                <Text>Targets</Text>
            </View>

            {/* Genre Module */}
            <View style={styles.moduleContainer}>
                <TouchableOpacity style={styles.selectionButtonBG}>
                    <Text style={styles.selectionButtonText}>관심사</Text>
                </TouchableOpacity>
                <Text>Genres</Text>
            </View>
            {/* <Spacer size={30} /> */}
            {/* Questions To Make */}
            <View style={styles.questionList}></View>

            {/* <Spacer size={30} /> */}
            <TouchableOpacity style={styles.plusButtonBG}>
                <View style={{ justifyContent: "center" }}>
                    <Text style={styles.plusButtonText}>+</Text>
                </View>
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
        // backgroundColor: colors.blurredGray,
        backgroundColor: colors.blurredGray,
        width: 60,
        // backgroundColor: "#000",
        fontWeight: "bold",
        justifyContent: "center",
        height: 30,
        borderRadius: 10,
        overflow: "hidden",
        marginHorizontal: 10,
        // marginVertical: marginSizes.m16,
    },
    selectionButtonText: {
        color: colors.buttonBlue,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },

    questionList: {
        // flex: 1,
        // marginVertical: 8,
        marginHorizontal: marginSizes.l20,
        flexGrow: 1,
        backgroundColor: colors.surveyBoxBackground,
        borderRadius: 10,
        overflow: "hidden",
        marginVertical: marginSizes.m16,
    },

    plusButtonBG: {
        backgroundColor: colors.deepMainColor,
        // height: 60,
        // flex: 1,
        // alignItems: 'center',
        // alignItems: "center",
        // flexBasis: 40,
        marginHorizontal: marginSizes.l20,
        marginBottom: marginSizes.xl24,
        borderRadius: 12,
        overflow: "hidden",
        justifyContent: "center",
    },
    plusButtonText: {
        color: colors.white,
        textAlign: "center",
        fontSize: 60,
        fontWeight: "bold",
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
