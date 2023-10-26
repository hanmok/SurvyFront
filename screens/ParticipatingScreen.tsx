import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { colors } from "../utils/colors";
import { fontSizes, marginSizes, borderSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../utils/NavHelper";
import { Question } from "../interfaces/Question";
import { SelectableOption } from "../interfaces/SelectableOption";
import SelectableOptionBox from "../components/SelectableOptionBox";
import ParticipatingQuestionBox from "../components/ParticipatingQuestionBox";
import TextButton from "../components/TextButton";
import { useNavigation } from "@react-navigation/native";
import SelectableOptionContainer from "../components/SelectableOptionContainer";
import { initialize } from "../features/selector/selectorSlice";
import { CustomAnswer } from "../interfaces/CustomAnswer";
import { useSelector, useDispatch } from "react-redux";
import { Answer } from "../interfaces/Answer";
import { RootState } from "../store";
import { createParticipate, postAnswer } from "../API/AnswerAPI";
import { API_BASE_URL } from "../API/API";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadUserState } from "../utils/Storage";
// import { NavigationTitle } from "../utils/NavigationTitle";
import { NavigationTitle } from "../utils/NavHelper";
import {
    convertKeysToCamelCaseRecursive,
    removeTypenameAndConvertToCamelCase,
} from "../utils/SnakeToCamel";
import { useApollo } from "../ApolloProvider";
import { useQuery } from "@apollo/client";
import { Survey } from "../interfaces/Survey";
import { getSurveyQuery } from "../API/gqlQuery";
import { log, logObject } from "../utils/Log";
import {
    GQLSurveyResponse,
    SurveyResponse,
} from "../interfaces/SurveyResponse";
import { GQLQuestion, GQLSurvey } from "../interfaces/GQLInterface";
import { StackNavigationProp } from "@react-navigation/stack";

interface Dictionary<T> {
    [key: number]: Set<T>;
}

function ParticipatingScreen({
    route,
    navigation,
}: {
    route: RouteProp<RootStackParamList, NavigationTitle.participate>;
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.participate
    >;
}) {
    const client = useApollo();
    const { loading, error, data } = useQuery<GQLSurveyResponse>(
        getSurveyQuery,
        {
            client,
            variables: { surveyId: route.params.surveyId },
            fetchPolicy: "no-cache",
        }
    );
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [questions, setQuestions] = useState<GQLQuestion[]>([]);
    // const [isLoading, setIsLoading] = useState<Boolean>(true);
    const [selectableOptions, setSelectableOptions] = useState<
        SelectableOption[]
    >([]);

    const shouldGoBack = useRef(false);
    const { sectionId, surveyId } = route.params;
    const dispatch = useDispatch();

    const selectedSOIndexIds = useSelector((state: RootState) => {
        const ret = state.selector.selectedOptionIds;
        logObject("selectedSOIndexIds changed to", ret);
        return ret;
        // return state.selector.selectedOptionIds;
    });

    const textAnswers = useSelector((state: RootState) => {
        return state.selector.textAnswers;
    });

    // const navigation = useNavigation();

    const [currentSurvey, setCurrentSurvey] = useState<GQLSurvey | null>(null);

    useEffect(() => {
        console.log("passed survey id:", surveyId);
        logObject("currentSurvey", currentSurvey);

        // if (currentSurvey) {
        if (data?.survey) {
            const updatedSurvey: GQLSurvey =
                removeTypenameAndConvertToCamelCase(data.survey);
            logObject("fetched survey", updatedSurvey);
            setCurrentSurvey(updatedSurvey); // currentSurvey 상태를 업데이트
            const currentSection = updatedSurvey.sections.find(
                s => s.sequence === currentSectionIndex
            );
            logObject("currentSection:", currentSection);
            setQuestions(currentSection.questions);
            dispatch(initialize(currentSection.questions.length));
            // setIsLoading(false);
        }
    }, [currentSectionIndex, data]);

    useEffect(() => {
        // 뒤로가기 버튼 누를 때 호출될 함수
        const unsubscribe = navigation.addListener("beforeRemove", e => {
            if (!shouldGoBack.current) {
                e.preventDefault(); // 뒤로가기 막기
                showAlertAndGoBack();
            }
        });
        return unsubscribe;
    }, [navigation]);

    const showAlertAndGoBack = () => {
        Alert.alert(
            "경고",
            "정말 뒤로가시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel",
                },
                {
                    text: "확인",
                    onPress: () => {
                        shouldGoBack.current = true;
                        navigation.goBack();
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const postSelectionAnswer = async (
        surveyId: number,
        userId: number,
        questionId: number,
        selectableOptionId: number
    ) => {
        logObject("[ParticipatingScreen] postSelectionAnswer", {
            questionId,
            selectableOptionId,
        });
        await postAnswer(surveyId, questionId, selectableOptionId, "", userId);
    };

    const postTextAnswer = async (
        customAnswer: CustomAnswer,
        userId: number,
        surveyId: number
    ) => {
        const { selectableOptionId, answerText, questionId } = customAnswer;
        logObject("[ParticipatingScreen] postTextAnswer", { customAnswer });
        await postAnswer(
            surveyId,
            questionId,
            selectableOptionId,
            answerText,
            userId
        );
    };

    const handleNextScreen = () => {
        console.log("handleNextScreen called");
        // navigation.goBack();
        navigation.navigate(NavigationTitle.endParticipation);
    };

    const handleCompleteSection = async () => {
        const userId = (await loadUserState()).userId;
        console.log(`buttonTapAction called, userId: ${userId}`);
        const promises = [];

        // ..?? selectedSOIndexIds 에 Text SO가 선택되어야 하는구나.
        // selectedSOIndexIds 에서 textAnswers 를 빼야해요.

        let selectableOptionIds: number[] = [];
        for (let j = 0; j < textAnswers.length; j++) {
            selectableOptionIds.push(textAnswers[j].selectableOptionId);
            const customAnswer = textAnswers[j];
            const postCall = postTextAnswer(customAnswer, userId, surveyId);
            logObject("[ParticipatingScreen] postTextAnswer", { customAnswer });
            promises.push(postCall);
        }

        for (let q = 0; q < questions.length; q++) {
            for (let i = 0; i < selectedSOIndexIds[q].length; i++) {
                const questionId = questions[q].id;
                const selectableOptionId = selectedSOIndexIds[q][i];

                if (!selectableOptionIds.includes(selectableOptionId)) {
                    const postCall = postSelectionAnswer(
                        surveyId,
                        userId,
                        questionId,
                        selectableOptionId
                    );
                    logObject("[ParticipatingScreen] postSelection", {
                        questionId,
                        selectableOptionId,
                    });
                    promises.push(postCall);
                }
            }
        }

        await Promise.all(promises)
            .then(() => {
                console.log(
                    `currentSectionIndex: ${currentSectionIndex}, number of sections: ${currentSurvey.sections.length}`
                );
                if (currentSectionIndex === currentSurvey.sections.length - 1) {
                    // shouldGoBack.current = true;
                    console.log(
                        "currentSectionIndex === currentSurvey.numOfSections - 1"
                    );
                    createParticipate(surveyId, userId).then(() => {
                        handleNextScreen();
                    });
                } else {
                    console.log(
                        "currentSectionIndex !== currentSurvey.numOfSections - 1"
                    );

                    dispatch(
                        initialize(
                            currentSurvey.sections[currentSectionIndex + 1]
                                .questions.length
                        )
                    );
                    setCurrentSectionIndex(currentSectionIndex + 1);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    if (loading) {
        return (
            <ActivityIndicator
                animating={loading}
                style={{ flex: 1 }}
                size={"large"}
                color={colors.deepMainColor}
            />
        );
    }

    const renderItem = ({ item }: { item: GQLQuestion }) => (
        <View style={styles.questionContainerBox}>
            <ParticipatingQuestionBox {...item} />
            {item.selectableOptions !== undefined &&
            item.selectableOptions.length > 0 ? (
                <SelectableOptionContainer
                    selectableOptions={item.selectableOptions}
                    questionType={item.questionType}
                    questionIndex={item.position}
                    questionId={item.id}
                />
            ) : (
                <Text>no selectable Options</Text>
            )}
        </View>
    );

    const listFooter = () => {
        return (
            currentSurvey !== null && (
                <TextButton
                    title={
                        currentSectionIndex ===
                        currentSurvey.sections.length - 1
                            ? "Finish"
                            : "Next"
                    }
                    onPress={handleCompleteSection}
                    textStyle={
                        selectedSOIndexIds &&
                        selectedSOIndexIds.every(arr => arr.length !== 0)
                            ? styles.activatedButtonText
                            : styles.inactivatedButtonText
                    }
                    backgroundStyle={
                        selectedSOIndexIds &&
                        selectedSOIndexIds.every(arr => arr.length !== 0)
                            ? styles.activatedFinishButtonBackground
                            : styles.inactivatedFinishButtonBackground
                    }
                />
            )
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <FlatList
                style={styles.flatListStyle}
                data={questions}
                renderItem={renderItem}
                // keyExtractor={item => `${item.selectableOptions[0].id} `}
                keyExtractor={item => `${item.id} `}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                ListFooterComponent={listFooter}
            />
        </KeyboardAvoidingView>
    );
}

export default ParticipatingScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        // marginHorizontal: 10,
        marginHorizontal: 20,
        marginBottom: 30,
    },
    flatListStyle: {
        alignSelf: "stretch",
    },
    questionContainerBox: {
        backgroundColor: colors.lightMainColor,
        marginVertical: marginSizes.s12,
        paddingVertical: 16,
        borderRadius: 20,
        overflow: "hidden",
        paddingBottom: 16,
        alignSelf: "stretch",
    },
    activatedButtonText: {
        textAlign: "center",
        fontSize: fontSizes.m20,
        letterSpacing: 1,
        color: "#fff",
    },
    inactivatedButtonText: {
        textAlign: "center",
        fontSize: fontSizes.m20,
        letterSpacing: 1,
        color: "#DDD",
    },
    activatedFinishButtonBackground: {
        marginTop: 20,
        // backgroundColor: colors.gray3,
        backgroundColor: "#666",
        alignSelf: "stretch",
        padding: 10,
        borderRadius: borderSizes.m10,
        height: 40,
        // width: 100,
    },
    inactivatedFinishButtonBackground: {
        marginTop: 20,
        backgroundColor: "#BBB",
        alignSelf: "stretch",
        padding: 10,
        borderRadius: borderSizes.m10,
        height: 40,
        // width: 100,
    },
});
