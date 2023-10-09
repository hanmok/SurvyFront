import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View, Alert } from "react-native";
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
import { CustomAnswer, initialize } from "../features/selector/selectorSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
    postSelectionAnswer,
    createParticipate,
    postTextAnswer,
} from "../API/AnswerAPI";
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
import { logObject } from "../utils/Log";

interface Dictionary<T> {
    [key: number]: Set<T>;
}

interface SurveyResponse {
    survey: Survey;
}

function ParticipatingScreen({
    route,
}: {
    route: RouteProp<RootStackParamList, NavigationTitle.participate>;
}) {
    const client = useApollo();
    const { loading, error, data } = useQuery<SurveyResponse>(getSurveyQuery, {
        client,
        variables: { surveyId: route.params.surveyId },
    });
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const [selectableOptions, setSelectableOptions] = useState<
        SelectableOption[]
    >([]);

    const shouldGoBack = useRef(false);
    const { sectionId, surveyId } = route.params;
    const dispatch = useDispatch();
    const selectedIndexIds = useSelector((state: RootState) => {
        return state.selector.selectedIndexIds;
    });
    const textAnswers = useSelector((state: RootState) => {
        return state.selector.textAnswers;
    });

    const navigation = useNavigation();

    // const currentSurvey: Survey = removeTypenameAndConvertToCamelCase(
    //     data?.survey
    // );

    const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);

    useEffect(() => {
        console.log("passed survey id:", surveyId);
        logObject("currentSurvey", currentSurvey);

        // if (currentSurvey) {
        if (data?.survey) {
            const updatedSurvey: Survey = removeTypenameAndConvertToCamelCase(
                data.survey
            );
            setCurrentSurvey(updatedSurvey); // currentSurvey 상태를 업데이트
            const currentSection = updatedSurvey.sections.find(
                s => s.sequence === currentSectionIndex
            );
            logObject("currentSection:", currentSection);
            setQuestions(currentSection.questions);
            dispatch(initialize(currentSection.questions.length));
            setIsLoading(false);
        }
        console.log("currentSectionIndex changed to " + currentSectionIndex);
        console.log("number of sections:", currentSurvey.sections.length);
        // setQuestions(currentSurvey.sections[currentSectionIndex].questions);
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

    const postEachSelectionAnswer = async (
        surveyId: number,
        userId: number,
        questionId: number,
        selectableOptionId: number
    ) => {
        await postSelectionAnswer(
            surveyId,
            userId,
            questionId,
            selectableOptionId
        );
    };

    const postEachTextAnswer = async (
        customAnswer: CustomAnswer,
        userId: number
    ) => {
        await postTextAnswer(customAnswer, userId);
    };

    const handleNextScreen = () => {
        console.log("handleNextScreen called");
        navigation.goBack();
    };

    const buttonTapAction = async () => {
        const userId = (await loadUserState()).userId;
        console.log(`buttonTapAction called, userId: ${userId}`);
        const promises = [];
        // section Idx 도 있어야 할 것 같은데?
        // 한번에 다 처리하고 싶은거 아니야? 맞아.
        for (let q = 0; q < questions.length; q++) {
            for (let i = 0; i < selectedIndexIds[q].length; i++) {
                const apiCall = postEachSelectionAnswer(
                    surveyId,
                    userId,
                    questions[q].id,
                    selectedIndexIds[q][i]
                );
                promises.push(apiCall);
            }
        }

        for (let j = 0; j < textAnswers.length; j++) {
            const apiCall = postEachTextAnswer(textAnswers[j], userId);
            promises.push(apiCall);
        }

        await Promise.all(promises)
            // .then(() => {
            //     createParticipate(surveyId, userId);
            // })
            .then(() => {
                console.log(
                    `currentSectionIndex: ${currentSectionIndex}, number of sections: ${currentSurvey.sections.length}`
                );
                if (currentSectionIndex === currentSurvey.sections.length - 1) {
                    shouldGoBack.current = true;
                    console.log(
                        "currentSectionIndex === currentSurvey.numOfSections - 1"
                    );
                    createParticipate(surveyId, userId).then(() => {
                        handleNextScreen();
                    });
                } else {
                    // dispatch(initialize())
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
                    // dispatch(initialize(currentSection.questions.length))
                    // dispatch(initialize())
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    if (isLoading) {
        return (
            <View>
                <Text>Loading..</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Question }) => (
        <View style={styles.questionContainerBox}>
            <ParticipatingQuestionBox {...item} />
            {item.selectableOptions !== undefined &&
            item.selectableOptions.length > 0 ? (
                <SelectableOptionContainer
                    selectableOptions={item.selectableOptions}
                    questionTypeId={item.questionTypeId}
                    questionIndex={item.position}
                    questionId={item.id}
                />
            ) : (
                <Text>no selectable Options</Text>
            )}
        </View>
    );

    return (
        // <View style={{ alignItems: "center" }}>
        <View style={styles.container}>
            <FlatList
                style={styles.flatListStyle}
                data={questions}
                renderItem={renderItem}
                keyExtractor={item => `${item.selectableOptions[0].id} `}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            />

            <TextButton
                title={
                    currentSectionIndex === currentSurvey.numOfSections - 1
                        ? "Finish"
                        : "Next"
                }
                onPress={buttonTapAction}
                // textStyle={if (selectedIndexes) styles.finishButtonText}
                textStyle={
                    selectedIndexIds.every(arr => arr.length !== 0)
                        ? styles.activatedButtonText
                        : styles.inactivatedButtonText
                }
                backgroundStyle={
                    selectedIndexIds.every(arr => arr.length !== 0)
                        ? styles.activatedFinishButtonBackground
                        : styles.inactivatedFinishButtonBackground
                }
            />
        </View>
    );
}

export default ParticipatingScreen;
// export default SurveyParticipateScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        // marginHorizontal: 10,
        marginHorizontal: 20,
    },

    flatListStyle: {
        alignSelf: "stretch",
    },
    questionContainerBox: {
        backgroundColor: colors.lightMainColor,
        // marginHorizontal: marginSizes.l20,
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
    },

    inactivatedFinishButtonBackground: {
        marginTop: 20,
        backgroundColor: "#BBB",
        alignSelf: "stretch",
        padding: 10,
        borderRadius: borderSizes.m10,
    },
});
