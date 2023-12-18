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

import { buttonColors, colors } from "../utils/colors";
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
// import { createParticipate, postAnswer } from "../API/AnswerAPI";
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
import { screenWidth } from "../utils/ScreenSize";
import { AnswerService } from "../API/Services/AnswerService";
import { ParticipatingService } from "../API/Services/ParticipatingService";

export interface TextAnswerForm {
    customAnswer: CustomAnswer;
    surveyId: number;
    userId: number;
    accessToken: string;
}

export interface SelectionAnswerForm {
    questionId: number;
    selectableOptionId: number;
    surveyId: number;
    userId: number;
    accessToken: string;
}

export interface NormalAnswerForm {
    surveyId: number;
    questionId: number;
    selectableOptionId: number;
    answerText: string;
    userId: number;
    accessToken: string;
}

export const convertTextToNormalForm = (
    ingre: TextAnswerForm
): NormalAnswerForm => {
    return {
        surveyId: ingre.surveyId,
        questionId: ingre.customAnswer.questionId,
        selectableOptionId: ingre.customAnswer.selectableOptionId,
        answerText: ingre.customAnswer.answerText,
        userId: ingre.userId,
        accessToken: ingre.accessToken,
    };
};

export const ConvertSelectionToNormalForm = (
    ingre: SelectionAnswerForm
): NormalAnswerForm => {
    return {
        surveyId: ingre.surveyId,
        questionId: ingre.questionId,
        selectableOptionId: ingre.selectableOptionId,
        answerText: "",
        userId: ingre.userId,
        accessToken: ingre.accessToken,
    };
};

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
    const answerService = new AnswerService();
    const participatingService = new ParticipatingService();
    const { sectionId, surveyId } = route.params;

    // Reducers
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

    const textAnswers = useSelector((state: RootState) => {
        return state.selector.textAnswers;
    });

    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

    const [shouldPost, setShouldPost] = useState(false);
    const [isSatisfied, setIsSatisfied] = useState(false);
    const [isNextTapped, setIsNextTapped] = useState(false);

    const [currentSurvey, setCurrentSurvey] = useState<GQLSurvey | null>(null);
    const [questions, setQuestions] = useState<GQLQuestion[]>([]);
    const { userId, accessToken, updateLoadingStatus } = useCustomContext();

    const moveToNextScreen = () => {
        console.log("handleNextScreen called");

        showToast(
            "success",
            "설문에 참여해주셔서 감사합니다",
            "포인트는 검수 후 지급됩니다"
        );

        navigation.navigate(NavigationTitle.endParticipation);
    };

    const dismissKeyboard = () => {
        console.log("keyboard dismissed");
        Keyboard.dismiss();
    };

    const toggleNextTapped = () => {
        setIsNextTapped(true);
    };

    const { loading, error, data } = useQuery<GQLSurveyResponse>(
        getSurveyQuery,
        {
            client,
            variables: { surveyId: route.params.surveyId },
            fetchPolicy: "no-cache",
        }
    );

    const postAnswerPromise = async (ingre: NormalAnswerForm) => {
        return await answerService.postAnswer(
            ingre.surveyId,
            ingre.questionId,
            ingre.selectableOptionId,
            ingre.answerText,
            ingre.userId,
            ingre.accessToken
        );
    };

    useEffect(() => {
        updateLoadingStatus(loading);
    }, [loading]);

    useEffect(() => {
        console.log("participatingScreen loaded, initializeAnswer called");
        dispatch(initializeAnswer);
    }, []);

    useEffect(() => {
        const callAPI = async () => {
            updateLoadingStatus(true);

            const ps = Array.from(myAnswerIngres).map(async body => {
                logObject("posting api", body);
                await postAnswerPromise(body);
            });

            await Promise.all(ps)
                .then(() => {
                    participatingService
                        .create(surveyId, userId, accessToken)
                        .then(() => {
                            updateLoadingStatus(false);
                            moveToNextScreen();
                        });
                })
                .catch(error => {
                    showToast("error", `${error.message}`);
                });
        };
        if (shouldPost) {
            callAPI();
        }
    }, [shouldPost]);

    useEffect(() => {
        logObject("selectedSoIndexIds", selectedSOIndexIds);
        const satisfied =
            selectedSOIndexIds &&
            selectedSOIndexIds.every(arr => arr.length !== 0);
        setIsSatisfied(satisfied);
    }, [selectedSOIndexIds]);

    useEffect(() => {
        console.log("passed survey id:", surveyId);
        logObject("currentSurvey", currentSurvey);

        if (data?.survey) {
            const updatedSurvey: GQLSurvey =
                removeTypenameAndConvertToCamelCase(data.survey);
            logObject("fetched survey", updatedSurvey);
            setCurrentSurvey(updatedSurvey);
            const currentSection = updatedSurvey.sections.find(
                s => s.sequence === currentSectionIndex
            );
            logObject("currentSection:", currentSection);
            setQuestions(currentSection.questions);
            dispatch(initializeSelections(currentSection.questions.length));
        }
    }, [currentSectionIndex, data]);

    useEffect(() => {
        const handleCompleteSection = async () => {
            console.log(`buttonTapAction called, userId: ${userId}`);

            let selectableOptionIds: number[] = [];
            for (let j = 0; j < textAnswers.length; j++) {
                selectableOptionIds.push(textAnswers[j].selectableOptionId);
                const customAnswer = textAnswers[j];

                const postTextIngre: TextAnswerForm = {
                    customAnswer,
                    surveyId,
                    userId,
                    accessToken,
                };

                const sth = convertTextToNormalForm(postTextIngre);

                dispatch(addToAnswerIngredients({ ingre: sth }));
                logObject("[ParticipatingScreen] postTextAnswer", {
                    customAnswer,
                });
            }

            for (let q = 0; q < questions.length; q++) {
                for (let i = 0; i < selectedSOIndexIds[q].length; i++) {
                    const questionId = questions[q].id;
                    const selectableOptionId = selectedSOIndexIds[q][i];

                    if (!selectableOptionIds.includes(selectableOptionId)) {
                        const postSelectionIngre: SelectionAnswerForm = {
                            questionId,
                            selectableOptionId,
                            surveyId,
                            userId,
                            accessToken,
                        };

                        const sth =
                            ConvertSelectionToNormalForm(postSelectionIngre);

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
        };

        if (isNextTapped) {
            handleCompleteSection();
            setIsNextTapped(false);
        }
    }, [isNextTapped]);

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
                            { letterSpacing: 10, color: "white" },
                            isSatisfied
                                ? styles.activatedButtonText
                                : styles.inactivatedButtonText,
                        ]}
                        backgroundStyle={[
                            isSatisfied
                                ? styles.activatedFinishButtonBackground
                                : styles.inactivatedFinishButtonBackground,
                        ]}
                        hasShadow={false}
                        isEnabled={isSatisfied}
                    />
                </View>
            )
        );
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="position">
            <TouchableNativeFeedback onPress={dismissKeyboard}>
                <View
                    style={{
                        flex: 1,
                        width: screenWidth - 40,
                    }}
                >
                    <FlatList
                        style={styles.flatListStyle} // alignSelf: stretch
                        data={questions}
                        renderItem={renderItem}
                        keyExtractor={item => `${item.id}${item.text} `}
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
    },
    inactivatedButtonText: {
        textAlign: "center",
        fontSize: fontSizes.m20,
    },
    activatedFinishButtonBackground: {
        marginTop: 20,
        // backgroundColor: "#666",
        backgroundColor: buttonColors.enabledButtonBG,
        alignSelf: "stretch",
        padding: 10,
        borderRadius: borderSizes.m10,
        height: 40,
    },
    inactivatedFinishButtonBackground: {
        marginTop: 20,
        // backgroundColor: "#BBB",
        backgroundColor: buttonColors.disabledButtonBG,
        alignSelf: "stretch",
        padding: 10,
        borderRadius: borderSizes.m10,
        height: 40,
    },
});
