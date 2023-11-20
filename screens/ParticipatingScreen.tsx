import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { colors } from "../utils/colors";
import { fontSizes, marginSizes, borderSizes } from "../utils/sizes";

import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../utils/NavHelper";

import ParticipatingQuestionBox from "../components/ParticipatingQuestionBox";
import TextButton from "../components/TextButton";

import SelectableOptionContainer from "../components/SelectableOptionContainer";
import { initialize } from "../features/selector/selectorSlice";
import { CustomAnswer } from "../interfaces/CustomAnswer";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../store";
import { createParticipate, postAnswer } from "../API/AnswerAPI";

// import { loadUserState } from "../utils/Storage";
// import { NavigationTitle } from "../utils/NavigationTitle";
import { NavigationTitle } from "../utils/NavHelper";
import {
    convertKeysToCamelCaseRecursive,
    removeTypenameAndConvertToCamelCase,
} from "../utils/SnakeToCamel";
import { useApollo } from "../ApolloProvider";
import { useQuery } from "@apollo/client";

import { getSurveyQuery } from "../API/gqlQuery";
import { log, logObject } from "../utils/Log";
import {
    GQLSurveyResponse,
    SurveyResponse,
} from "../interfaces/SurveyResponse";
import { GQLQuestion, GQLSurvey } from "../interfaces/GQLInterface";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCustomContext } from "../features/context/CustomContext";

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
    const [isLoading, setIsLoading] = useState(false);
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

    const answerPromises: Promise<void>[] = [];

    const [isNextTapped, setIsNextTapped] = useState(false);
    const shouldGoBack = useRef(false);
    const { sectionId, surveyId } = route.params;
    const dispatch = useDispatch();

    const selectedSOIndexIds = useSelector((state: RootState) => {
        const ret = state.selector.selectedOptionIds;
        logObject("selectedSOIndexIds changed to", ret);
        return ret;
    });
    const [isSatisfied, setIsSatisfied] = useState(false);

    useEffect(() => {
        const satisfied =
            selectedSOIndexIds &&
            selectedSOIndexIds.every(arr => arr.length !== 0);
        setIsSatisfied(satisfied);
    }, [selectedSOIndexIds]);

    const textAnswers = useSelector((state: RootState) => {
        return state.selector.textAnswers;
    });

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
        }
    }, [currentSectionIndex, data]);

    // useEffect(() => {
    //     const showAlertAndGoBack = () => {
    //         Alert.alert(
    //             "경고",
    //             "정말 뒤로가시겠습니까?",
    //             [
    //                 {
    //                     text: "취소",
    //                     style: "cancel",
    //                 },
    //                 {
    //                     text: "확인",
    //                     onPress: () => {
    //                         shouldGoBack.current = true;
    //                         navigation.goBack();
    //                     },
    //                 },
    //             ],
    //             { cancelable: false }
    //         );
    //     };
    //         // navigation.addListener("")
    //     // 뒤로가기 버튼 누를 때 호출될 함수
    //     const unsubscribe = navigation.addListener("beforeRemove", e => {
    //         if (!shouldGoBack.current) {
    //             e.preventDefault(); // 뒤로가기 막기
    //             showAlertAndGoBack();
    //         }
    //     });
    //     return () => {
    //         unsubscribe();
    //     };

    // }, [navigation]);

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
        await postAnswer(
            surveyId,
            questionId,
            selectableOptionId,
            "",
            userId,
            accessToken
        );
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
            userId,
            accessToken
        );
    };

    const moveToNextScreen = () => {
        console.log("handleNextScreen called");
        navigation.navigate(NavigationTitle.endParticipation);
    };

    // TODO: 이거.. 여기가 맞니? 버튼 눌린 변수와 연동시켜야함.
    const { userId, accessToken } = useCustomContext();
    useEffect(() => {
        const handleCompleteSection = async () => {
            console.log(`buttonTapAction called, userId: ${userId}`);
            const promises: Promise<void>[] = [];

            // ..?? selectedSOIndexIds 에 Text SO가 선택되어야 하는구나.
            // selectedSOIndexIds 에서 textAnswers 를 빼야해요.

            let selectableOptionIds: number[] = [];
            for (let j = 0; j < textAnswers.length; j++) {
                selectableOptionIds.push(textAnswers[j].selectableOptionId);
                const customAnswer = textAnswers[j];
                const postCall = postTextAnswer(customAnswer, userId, surveyId);
                logObject("[ParticipatingScreen] postTextAnswer", {
                    customAnswer,
                });
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

            promises.forEach(p => {
                answerPromises.push(p);
            });

            if (currentSectionIndex === currentSurvey.sections.length - 1) {
                setIsLoading(true);
                await Promise.all(answerPromises)
                    .then(() => {
                        createParticipate(surveyId, userId, accessToken).then(
                            () => {
                                setIsLoading(false);
                                moveToNextScreen();
                            }
                        );
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                dispatch(
                    initialize(
                        currentSurvey.sections[currentSectionIndex + 1]
                            .questions.length
                    )
                );
                setCurrentSectionIndex(currentSectionIndex + 1);
            }
        };

        if (isNextTapped) {
            handleCompleteSection();
            setIsNextTapped(false);
        }
    }, [isNextTapped]);

    const toggleNextTapped = () => {
        setIsNextTapped(true);
    };

    const { updateLoadingStatus } = useCustomContext();
    useEffect(() => {
        updateLoadingStatus(loading || isLoading);
    }, [loading, isLoading]);

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
                            ? "제출"
                            : "다음"
                    }
                    onPress={toggleNextTapped}
                    textStyle={
                        isSatisfied
                            ? styles.activatedButtonText
                            : styles.inactivatedButtonText
                    }
                    backgroundStyle={
                        isSatisfied
                            ? styles.activatedFinishButtonBackground
                            : styles.inactivatedFinishButtonBackground
                    }
                    hasShadow={false}
                    isEnabled={isSatisfied}
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
                keyExtractor={item => `${item.id}${item.text} `}
                // ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListFooterComponent={listFooter}
            />
        </KeyboardAvoidingView>
    );
}

export default ParticipatingScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginHorizontal: 20,
        marginBottom: 30,
    },
    flatListStyle: {
        alignSelf: "stretch",
    },
    questionContainerBox: {
        backgroundColor: colors.white,
        borderColor: colors.gray4,
        borderWidth: 1,
        paddingVertical: 16,
        borderRadius: 12,
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
        backgroundColor: "#666",
        alignSelf: "stretch",
        padding: 10,
        borderRadius: borderSizes.m10,
        height: 40,
    },
    inactivatedFinishButtonBackground: {
        marginTop: 20,
        backgroundColor: "#BBB",
        alignSelf: "stretch",
        padding: 10,
        borderRadius: borderSizes.m10,
        height: 40,
        // marginHorizontal: 10,
        // marginBottom: 10,
    },
});
