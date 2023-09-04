import React from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    ScrollView,
    SectionList,
} from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { fontSizes, marginSizes, borderSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import Spacer from "../components/Spacer";
import TextButton from "../components/TextButton";
import ImageButton from "../components/ImageButton";
import PostingQuestionBox from "../components/PostingQuestionBox";
import { useState } from "react";

// Header, Footer 로 중첩 Scroll 해결하기.
export default function SurveyRequestScreen() {
    const [customViews, setCustomViews] = useState([]);

    const handleAddCustomView = inputValue => {
        setCustomViews(prevViews => [...prevViews, inputValue]);
    };

    return (
        <SafeAreaView style={styles.container} edges={[]}>
            <ScrollView style={styles.questionList}>
                {/* <ScrollView> */}
                <TextInput
                    placeholder="설문 제목을 입력해주세요"
                    style={styles.surveyTitle}
                />
                <View style={styles.moduleContainer}>
                    <TextButton
                        backgroundStyle={styles.selectionButtonBG}
                        textStyle={styles.selectionButtonText}
                        title="타겟층"
                        onPress={console.log}
                    />
                    <Text>Targets</Text>
                </View>

                {/* Genre Module */}
                <View style={[styles.moduleContainer, { marginBottom: 20 }]}>
                    <TextButton
                        backgroundStyle={styles.selectionButtonBG}
                        textStyle={styles.selectionButtonText}
                        title="관심사"
                        onPress={console.log}
                    />
                    <Text>Genres</Text>
                </View>

                {/* Questions To Make. List 로 만들 것. */}

                {/* 이거.. List 로 어떻게 뿌리지 ? Section List 써야할 것 같은데 ? */}
                {/* <SectionList
                    sections={[
                        {
                            sectionIndex: 1,
                            data: [customViews.length + 1],
                        },
                        {
                            sectionIndex: 2,
                            data: [customViews.length + 2],
                        },
                    ]}
                    renderItem={({ item }) => (
                        <PostingQuestionBox index={item} />
                    )}
                    renderSectionHeader={({ section }) => (
                        <Text style={styles.sectionHeader} numberOfLines={1}>
                            Section {section.sectionIndex}
                        </Text>
                    )}
                    keyExtractor={item => `basicListEntry-${item}`}
                /> */}

                <View style={{ justifyContent: "center" }}>
                    <TextButton
                        title="+"
                        onPress={() => console.log}
                        textStyle={[
                            styles.plusButtonText,
                            { textAlignVertical: "center" },
                        ]}
                        backgroundStyle={[
                            styles.plusButtonBG,
                            { justifyContent: "center" },
                        ]}
                    />
                </View>

                {/* <PostingQuestionBox/></PostingQuestionBox> */}
            </ScrollView>

            <Text style={styles.expectedTime}>예상 소요시간 2분</Text>

            <TextButton
                textStyle={styles.requestText}
                backgroundStyle={styles.requestButtonBG}
                title="설문 요청하기"
                onPress={console.log}
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
        borderRadius: borderSizes.m10,
        marginHorizontal: marginSizes.m16,
        height: 50,
        marginTop: marginSizes.xxs4,
        marginBottom: marginSizes.xxs4,
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
        borderRadius: borderSizes.m10,
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

    sectionHeader: {
        marginLeft: marginSizes.xs8,
        fontWeight: "500",
        marginTop: marginSizes.l20,
        marginBottom: marginSizes.xs8,
        backgroundColor: colors.selectedQuestionBoxBG,
        borderRadius: 5,
        overflow: "hidden",
        paddingHorizontal: 10,
        width: 90,
        textAlign: "center",
        // width: 200,
        // whiteSpace: "nowrap",
        // textOverflow: "ellipsis",
    },

    plusButtonBG: {
        backgroundColor: colors.deepMainColor,
        marginBottom: marginSizes.xl24,
        marginTop: marginSizes.s12,
        borderRadius: 12,
        overflow: "hidden",
        justifyContent: "center",
        height: 50,
    },
    plusButtonText: {
        color: colors.white,
        textAlign: "center",
        // fontSize: 60,
        fontSize: 40,
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
        borderRadius: borderSizes.m10,
        padding: 10,
        // backgroundColor: colors.inactiveBtnBG,
        marginBottom: marginSizes.l20,
    },
    requestText: {
        color: colors.white,
        textAlign: "center",
        fontSize: 20,
    },
});
