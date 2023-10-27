import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import {
    GQLAnswerResponse,
    GQLParticipatingResponse,
    GQLSurveyResponse,
} from "../interfaces/SurveyResponse";
import {
    getAnswersQuery,
    getSurveyQuery,
    getParticipatingQuery,
} from "../API/gqlQuery";
import { useApollo } from "../ApolloProvider";
import React, { useEffect, useState } from "react";

import {
    GQLAnswer,
    GQLParticipating,
    GQLSelectableOption,
    GQLSurvey,
} from "../interfaces/GQLInterface";

import { removeTypenameAndConvertToCamelCase } from "../utils/SnakeToCamel";
import { log, logObject } from "../utils/Log";
import OverallSelectionResponseContainer from "../components/response/OverallSelectionResponseContainer";
import { QuestionResponseContainerProps } from "../components/response/OverallSelectionResponseContainer";
import { ListRenderItem } from "react-native";
import { fontSizes, marginSizes } from "../utils/sizes";
import { convertIdToType } from "../enums/QuestionTypeEnum";
import { colors } from "../utils/colors";
import { screenWidth } from "../utils/ScreenSize";
import OverallEssayResponseContainer from "../components/response/OverallEssayResponseContainer";
import { Picker } from "@react-native-picker/picker";
import CustomSegmentedControl from "../components/CustomSegmentedControl";
import { Answer } from "../interfaces/Answer";
import IndivisualSelectionResponseContainer from "../components/response/IndivisualSelectionResponseContainer";
import IndivisualEssayResponseContainer from "../components/response/IndivisualEssayResponseContainer";
import ImageButton from "../components/ImageButton";
import { Entypo, Feather, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import TextButton from "../components/TextButton";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ResponseScreen({
    navigation,
    route,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.response
    >;
    route: RouteProp<RootStackParamList, NavigationTitle.response>;
}) {
    const { surveyId } = route.params;
    const client = useApollo();
    const options = ["전체", "개별"];

    const [currentSequence, setCurrentSequence] = useState<number>(1);
    const [currentUserId, setCurrentUserId] = useState<number>(undefined);
    // const [indivisualAnswers, setIndivisualAnswers] = useState<GQLAnswer[]>([]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ marginRight: 10 }}>
                    <TouchableOpacity
                        onPress={() => console.log("Share btn tapped!")}
                    >
                        <Ionicons
                            name="ios-share-outline"
                            size={30}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const {
        loading: answersLoading,
        error: answersError,
        data: answersData,
    } = useQuery<GQLAnswerResponse>(getAnswersQuery, {
        client,
        variables: { surveyId: route.params.surveyId },
        fetchPolicy: "no-cache",
    });

    const {
        loading: participatingLoading,
        error: participatingError,
        data: participatingData,
    } = useQuery<GQLParticipatingResponse>(getParticipatingQuery, {
        client,
        variables: { surveyId: route.params.surveyId },
        fetchPolicy: "no-cache",
    });

    const {
        loading: surveyLoading,
        error: surveyError,
        data: surveyData,
    } = useQuery<GQLSurveyResponse>(getSurveyQuery, {
        client,
        variables: { surveyId: route.params.surveyId },
        fetchPolicy: "no-cache",
    });

    const [survey, setSurvey] = useState<GQLSurvey>(null);
    const [answers, setAnswers] = useState<GQLAnswer[]>(null);
    const [participatings, setParticipatings] =
        useState<GQLParticipating[]>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isShowingOverall, setIsShowingOverall] = useState<boolean>(true);

    const [responseProps, setResponseProps] = useState<
        QuestionResponseContainerProps[]
    >([]);

    useEffect(() => {
        if (participatings && participatings.length !== 0) {
            logObject(
                "[ResponseScreen] currentSequence changed, participatings ",
                participatings
            );
            log("currentSequence: " + currentSequence);
            const correspondingUserId = participatings.find(
                participating => participating.sequence === currentSequence
            ).user.id;

            logObject(
                "[ResponseScreen] currentUserId set to",
                correspondingUserId
            );

            setCurrentUserId(correspondingUserId);
        }
    }, [currentSequence, participatings]);

    useEffect(() => {
        console.log("passed survey id:", surveyId);

        if (answersData?.answers) {
            const updatedAnswers: GQLAnswer[] =
                removeTypenameAndConvertToCamelCase(answersData.answers);
            logObject("fetched answers", updatedAnswers);
            setAnswers(updatedAnswers);
        } else {
            log("still fetching answers..");
        }
    }, [answersData]);

    useEffect(() => {
        if (surveyData?.survey) {
            const updatedSurvey: GQLSurvey =
                removeTypenameAndConvertToCamelCase(surveyData.survey);
            logObject("fetched survey", updatedSurvey);
            setSurvey(updatedSurvey);
        }
    }, [surveyData]);

    useEffect(() => {
        if (participatingData?.participatings) {
            const updatedParticipatings: GQLParticipating[] =
                removeTypenameAndConvertToCamelCase(
                    participatingData.participatings
                );
            logObject("fetched participatings", updatedParticipatings);
            setParticipatings(updatedParticipatings);
        }
    }, [participatingData]);

    useEffect(() => {
        if (
            answers &&
            answers.length !== 0 &&
            survey !== null &&
            participatings
        ) {
            let tempQuestionResponseContainerProps: QuestionResponseContainerProps[] =
                [];
            logObject("survey:", survey);
            logObject("answers:", answers);

            survey.sections.forEach(section => {
                // question sorted 된거 사용하기.
                section.questions.sort();
                section.questions.forEach((question, index) => {
                    const selectableOptions = question.selectableOptions;

                    // q id 가 같은 질문들
                    const tempAnswers = answers.filter(
                        ans => ans.question.id === question.id
                    );

                    const props: QuestionResponseContainerProps = {
                        questionTitle: ` ${question.position + 1}. ${
                            question.text
                        }`,
                        selectableOptions: selectableOptions,
                        answers: tempAnswers,
                        questionTypeId: String(question.questionType.id),
                        selectedUserId: undefined,
                        // questionType: questionType,
                    };
                    // logObject("prop obj", props);

                    tempQuestionResponseContainerProps.push(props);
                });
            });
            setResponseProps(tempQuestionResponseContainerProps);
        }
    }, [answers, survey]);
    // }, [surveyData, answersData]);

    if (surveyError) {
        return <Text>survey Error</Text>;
    }

    if (answersError) {
        return <Text>Answer Error</Text>;
    }

    if (participatingError) {
        return <Text>Participating Error</Text>;
    }

    useEffect(() => {
        if (surveyLoading || answersLoading || participatingLoading) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [surveyLoading, answersLoading, participatingLoading]);

    if (surveyLoading || answersLoading || participatingLoading) {
        return (
            <ActivityIndicator
                animating={isLoading}
                style={{ flex: 1 }}
                size={"large"}
                color={colors.deepMainColor}
            />
        );
    }

    const countUp = () => {
        const updatedSequence = currentSequence + 1;
        if (participatings && participatings.length >= updatedSequence) {
            setCurrentSequence(updatedSequence);
        }
    };

    const countDown = () => {
        const updatedSequence = currentSequence - 1;

        if (updatedSequence > 0) {
            setCurrentSequence(updatedSequence);
        }
    };

    const overallQuestionResponseBoxItem: ListRenderItem<
        QuestionResponseContainerProps
    > = ({ item }) => {
        return item.questionTypeId !== "300" ? (
            <OverallSelectionResponseContainer
                questionTitle={item.questionTitle}
                selectableOptions={item.selectableOptions}
                answers={item.answers}
                questionTypeId={item.questionTypeId}
                selectedUserId={undefined}
            />
        ) : (
            <OverallEssayResponseContainer
                questionTitle={item.questionTitle}
                selectableOptions={[]} // 필요 없음.
                answers={item.answers}
                questionTypeId={item.questionTypeId}
                selectedUserId={undefined}
            />
        );
    };

    const bottomOverallView = () => {
        return (
            <Text
                style={{
                    alignSelf: "flex-end",
                    marginRight: 30,
                    fontSize: fontSizes.s16,
                    marginTop: 10,
                }}
            >
                총 설문 인원 {survey ? survey.currentParticipation : 0}
            </Text>
        );
    };

    const indivisualQuestionResponseBoxItem: ListRenderItem<
        QuestionResponseContainerProps
    > = ({ item }) => {
        return item.questionTypeId !== "300" ? (
            <IndivisualSelectionResponseContainer
                questionTitle={item.questionTitle}
                selectableOptions={item.selectableOptions}
                answers={item.answers}
                questionTypeId={item.questionTypeId}
                selectedUserId={currentUserId}
            />
        ) : (
            <IndivisualEssayResponseContainer
                questionTitle={item.questionTitle}
                selectableOptions={[]} // 필요 없음.
                answers={item.answers}
                questionTypeId={item.questionTypeId}
                selectedUserId={currentUserId}
            />
        );
    };

    return (
        <View style={styles.container}>
            <Text style={{ color: colors.gray3 }}>surveyId: {surveyId}</Text>
            {currentUserId && (
                <Text style={{ color: colors.gray3 }}>
                    currentUserId: {currentUserId ?? 0}
                </Text>
            )}
            <Text
                style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    textAlign: "center",
                }}
            >
                {survey ? survey.title : ""}
            </Text>
            <View
                style={{ height: 30, flex: 1, justifyContent: "space-between" }}
            >
                <>
                    {isShowingOverall ? (
                        <FlatList
                            data={responseProps}
                            renderItem={overallQuestionResponseBoxItem}
                            keyExtractor={item => `${item.questionTitle}`}
                            ItemSeparatorComponent={() => {
                                return <View style={{ height: 10 }} />;
                            }}
                        />
                    ) : (
                        <FlatList
                            data={responseProps}
                            renderItem={indivisualQuestionResponseBoxItem}
                            keyExtractor={item => `${item.questionTitle}`}
                            ItemSeparatorComponent={() => {
                                return <View style={{ height: 10 }} />;
                            }}
                        />
                    )}
                </>
                <View
                    style={{
                        // backgroundColor: "magenta",
                        width: screenWidth - 24,
                        height: 100,
                    }}
                >
                    {isShowingOverall ? (
                        bottomOverallView()
                    ) : (
                        <View
                            style={{
                                // backgroundColor: "cyan",
                                alignSelf: "flex-end",
                                marginRight: 30,
                                marginTop: 10,
                                flexDirection: "row",
                                // paddingBottom: 10,
                            }}
                        >
                            <Entypo
                                name="chevron-left"
                                onPress={countDown}
                                size={24}
                            />

                            <TextButton
                                title={`${currentSequence}`}
                                textStyle={{ textAlign: "center" }}
                                backgroundStyle={{
                                    marginHorizontal: 6,
                                    width: 40,
                                    borderRadius: 6,
                                    backgroundColor: colors.blurredGray,
                                    overflow: "hidden",
                                }}
                                onPress={countDown}
                            />
                            <Entypo
                                name="chevron-right"
                                onPress={countUp}
                                size={24}
                            />
                        </View>
                    )}

                    <CustomSegmentedControl
                        options={options}
                        handlePress={idx => {
                            setIsShowingOverall(idx === 0);
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: marginSizes.s12,
        flex: 1,
    },
});
