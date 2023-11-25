import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableNativeFeedback,
} from "react-native";

import { colors } from "../utils/colors";
import { fontSizes, marginSizes, borderSizes } from "../utils/sizes";

import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../utils/NavHelper";

import ParticipatingQuestionBox from "../components/ParticipatingQuestionBox";
import TextButton from "../components/TextButton";

import SelectableOptionContainer from "../components/SelectableOptionContainer";
import {
    addToAnswerIngredients,
    initializeAnswer,
    initializeSelections,
} from "../features/selector/selectorSlice";
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
import showToast from "../components/common/toast/Toast";
import showAdminToast from "../components/common/toast/showAdminToast";

export interface PostTextAnswerIngre {
    customAnswer: CustomAnswer;
    surveyId: number;
    userId: number;
    accessToken: string;
}

export interface PostSelectionAnswerIngre {
    questionId: number;
    selectableOptionId: number;
    surveyId: number;
    userId: number;
    accessToken: string;
}

export interface PostAnswerIngre {
    surveyId: number;
    questionId: number;
    selectableOptionId: number;
    answerText: string;
    userId: number;
    accessToken: string;
}

export const makePostTextAnswer = (
    ingre: PostTextAnswerIngre
): PostAnswerIngre => {
    return {
        surveyId: ingre.surveyId,
        questionId: ingre.customAnswer.questionId,
        selectableOptionId: ingre.customAnswer.selectableOptionId,
        answerText: ingre.customAnswer.answerText,
        userId: ingre.userId,
        accessToken: ingre.accessToken,
    };
};

export const makePostSelectionAnswer = (
    ingre: PostSelectionAnswerIngre
): PostAnswerIngre => {
    return {
        surveyId: ingre.surveyId,
        questionId: ingre.questionId,
        selectableOptionId: ingre.selectableOptionId,
        answerText: "",
        userId: ingre.userId,
        accessToken: ingre.accessToken,
    };
};

// 화면 깨짐 발생함
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

    // const answerIngredients: PostAnswerIngre[] = [];

    const [answerIngredients, setAnswerIngredients] = useState<
        PostAnswerIngre[]
    >([]);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        console.log("participatingScreen loaded");

        dispatch(initializeAnswer);
    }, []);
    const answerPromises: Promise<void>[] = [];

    const [shouldPost, setShouldPost] = useState(false);

    useEffect(() => {
        logObject("answerIngredients changed to", answerIngredients);
    }, [answerIngredients]);

    // 왜 마지막에만 해야해? 계속 하면 안돼? Answer 에서 똥이 나와서그래. 필요 없는 데이터들.

    useEffect(() => {
        const callAPI = async () => {
            updateLoadingStatus(true);

            showAdminToast("success", "posting apis called");
            logObject("current answerIngre flag 3", answerIngredients);

            // setTimeout(() => {
            //     console.log("taking rest");
            // }, 3000);

            const ps = Array.from(myAnswerIngres).map(async body => {
                logObject("posting api", body);
                await myPostAnswer(body);
            });

            await Promise.all(ps)
                .then(() => {
                    createParticipate(surveyId, userId, accessToken).then(
                        () => {
                            updateLoadingStatus(false);
                            moveToNextScreen();
                        }
                    );
                })
                .catch(error => {
                    showToast("error", `${error.message}`);
                });
        };
        if (shouldPost) {
            callAPI();
        }
    }, [shouldPost, answerIngredients]);

    const [isNextTapped, setIsNextTapped] = useState(false);
    const shouldGoBack = useRef(false);
    const { sectionId, surveyId } = route.params;
    const dispatch = useDispatch();

    const selectedSOIndexIds = useSelector((state: RootState) => {
        const ret = state.selector.selectedOptionIds;
        logObject("selectedSOIndexIds changed to", ret);
        return ret;
    });

    const myAnswerIngres = useSelector((state: RootState) => {
        const ret = state.selector.answerIngredients;
        logObject("myAnswerIngres", myAnswerIngres);
        return ret;
    });

    const [isSatisfied, setIsSatisfied] = useState(false);

    const textAnswers = useSelector((state: RootState) => {
        return state.selector.textAnswers;
    });

    const [currentSurvey, setCurrentSurvey] = useState<GQLSurvey | null>(null);

    useEffect(() => {
        logObject("selectedSoIndexIds", selectedSOIndexIds);
        const satisfied =
            selectedSOIndexIds &&
            selectedSOIndexIds.every(arr => arr.length !== 0);
        setIsSatisfied(satisfied);
    }, [selectedSOIndexIds]);

    const dismissKeyboard = () => {
        console.log("keyboard dismissed");
        Keyboard.dismiss();
    };

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
            dispatch(initializeSelections(currentSection.questions.length));
        }
    }, [currentSectionIndex, data]);

    // const postSelectionAnswer = async (
    //     surveyId: number,
    //     userId: number,
    //     questionId: number,
    //     selectableOptionId: number
    // ) => {
    //     logObject("[ParticipatingScreen] postSelectionAnswer", {
    //         questionId,
    //         selectableOptionId,
    //     });
    //     await postAnswer(
    //         surveyId,
    //         questionId,
    //         selectableOptionId,
    //         "",
    //         userId,
    //         accessToken
    //     );
    // };

    const myPostAnswer = async (ingre: PostAnswerIngre) => {
        return await postAnswer(
            ingre.surveyId,
            ingre.questionId,
            ingre.selectableOptionId,
            ingre.answerText,
            ingre.userId,
            ingre.accessToken
        );
    };

    //     surveyId: number, questionId: number, selectableOptionId: number, answerText: string, userId: number, accessToken: string): Promise<unknown>
    // import postAnswer

    // const postSelectionAnswer = (
    //     surveyId: number,
    //     userId: number,
    //     questionId: number,
    //     selectableOptionId: number
    // ): Promise<void> => {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             await postAnswer(
    //                 surveyId,
    //                 questionId,
    //                 selectableOptionId,
    //                 "",
    //                 userId,
    //                 accessToken
    //             );

    //             resolve();
    //         } catch (error) {
    //             reject(error);
    //         }
    //     });
    // };

    // const postTextAnswer = async (
    //     customAnswer: CustomAnswer,
    //     userId: number,
    //     surveyId: number
    // ) => {
    //     const { selectableOptionId, answerText, questionId } = customAnswer;
    //     logObject("[ParticipatingScreen] postTextAnswer", { customAnswer });

    //     await postAnswer(
    //         surveyId,
    //         questionId,
    //         selectableOptionId,
    //         answerText,
    //         userId,
    //         accessToken
    //     );
    // };

    // const postTextAnswer = (
    //     customAnswer: CustomAnswer,
    //     userId: number,
    //     surveyId: number
    // ): Promise<void> => {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const { selectableOptionId, answerText, questionId } =
    //                 customAnswer;
    //             logObject("[ParticipatingScreen] postTextAnswer", {
    //                 customAnswer,
    //             });

    //             await postAnswer(
    //                 surveyId,
    //                 questionId,
    //                 selectableOptionId,
    //                 answerText,
    //                 userId,
    //                 accessToken
    //             );
    //             resolve();
    //         } catch (error) {
    //             reject(error);
    //         }
    //     });
    // };

    const moveToNextScreen = () => {
        console.log("handleNextScreen called");
        navigation.navigate(NavigationTitle.endParticipation);
    };

    // TODO: 이거.. 여기가 맞니? 버튼 눌린 변수와 연동시켜야함.
    const { userId, accessToken, updateLoadingStatus } = useCustomContext();

    useEffect(() => {
        const handleCompleteSection = async () => {
            console.log(`buttonTapAction called, userId: ${userId}`);
            // const promises: Promise<void>[] = [];

            let selectableOptionIds: number[] = [];
            for (let j = 0; j < textAnswers.length; j++) {
                selectableOptionIds.push(textAnswers[j].selectableOptionId);
                const customAnswer = textAnswers[j];
                // const postCall = postTextAnswer(customAnswer, userId, surveyId);

                const postTextIngre: PostTextAnswerIngre = {
                    customAnswer,
                    surveyId,
                    userId,
                    accessToken,
                };
                const sth = makePostTextAnswer(postTextIngre);
                // answerIngredients.push(sth);
                // const updated = [...answerIngredients, sth];
                // setAnswerIngredients(updated);
                setAnswerIngredients(prev => [...prev, sth]);
                dispatch(addToAnswerIngredients({ ingre: sth }));
                logObject("[ParticipatingScreen] postTextAnswer", {
                    customAnswer,
                });
                // promises.push(postCall);
                // answerPromises.push(postCall);
            }

            for (let q = 0; q < questions.length; q++) {
                for (let i = 0; i < selectedSOIndexIds[q].length; i++) {
                    const questionId = questions[q].id;
                    const selectableOptionId = selectedSOIndexIds[q][i];

                    if (!selectableOptionIds.includes(selectableOptionId)) {
                        const postSelectionIngre: PostSelectionAnswerIngre = {
                            questionId,
                            selectableOptionId,
                            surveyId,
                            userId,
                            accessToken,
                        };

                        const sth = makePostSelectionAnswer(postSelectionIngre);

                        // answerIngredients.push(sth);
                        // const updated = [...answerIngredients, sth];
                        // setAnswerIngredients(updated);
                        // setAnswerIngredients(prev => [...prev, sth]);
                        dispatch(addToAnswerIngredients({ ingre: sth }));
                        logObject("[ParticipatingScreen] postSelection", {
                            questionId,
                            selectableOptionId,
                        });
                    }
                }
            }

            console.log("current section: ", currentSectionIndex);
            console.log(
                "currentSurvey.sections.length: ",
                currentSurvey.sections.length
            );

            logObject("current answerIngre flag 2", answerIngredients);

            if (currentSectionIndex === currentSurvey.sections.length - 1) {
                setShouldPost(true);
            } else {
                dispatch(
                    initializeSelections(
                        currentSurvey.sections[currentSectionIndex + 1]
                            .questions.length
                    )
                );
                setCurrentSectionIndex(currentSectionIndex + 1);
            }

            logObject("current answerIngre flag 1", answerIngredients);
        };

        if (isNextTapped) {
            handleCompleteSection();
            setIsNextTapped(false);
        }
    }, [isNextTapped]);

    const toggleNextTapped = () => {
        setIsNextTapped(true);
    };

    useEffect(() => {
        updateLoadingStatus(loading);
    }, [loading]);

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
                <View>
                    <TextButton
                        title={
                            currentSectionIndex ===
                            currentSurvey.sections.length - 1
                                ? "제출"
                                : "다음"
                        }
                        onPress={toggleNextTapped}
                        textStyle={[
                            { letterSpacing: 10 },
                            isSatisfied
                                ? styles.activatedButtonText
                                : styles.inactivatedButtonText,
                        ]}
                        backgroundStyle={
                            isSatisfied
                                ? styles.activatedFinishButtonBackground
                                : styles.inactivatedFinishButtonBackground
                        }
                        hasShadow={false}
                        isEnabled={isSatisfied}
                    />
                    {/* <View style={{ height: 500 }}></View> */}
                </View>
            )
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            // behavior={Platform.OS === "ios" ? "position" : "position"}
            behavior="position"
        >
            <TouchableNativeFeedback
                onPress={dismissKeyboard}
                // style={styles.container}
            >
                <View style={{ flex: 1 }}>
                    <FlatList
                        style={styles.flatListStyle}
                        data={questions}
                        renderItem={renderItem}
                        keyExtractor={item => `${item.id}${item.text} `}
                        // ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 10 }} />
                        )}
                        ListFooterComponent={listFooter}
                    />
                </View>
            </TouchableNativeFeedback>
        </KeyboardAvoidingView>
    );
}

export default ParticipatingScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginHorizontal: 20,
        marginBottom: 30,
        flex: 1,
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
        color: "#fff",
    },
    inactivatedButtonText: {
        textAlign: "center",
        fontSize: fontSizes.m20,
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
    },
});
