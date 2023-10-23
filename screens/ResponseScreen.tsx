import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import {
    GQLAnswerResponse,
    GQLSurveyResponse,
} from "../interfaces/SurveyResponse";
import { getAnswersQuery, getSurveyQuery } from "../API/gqlQuery";
import { useApollo } from "../ApolloProvider";
import { useEffect, useState } from "react";
import {
    GQLAnswer,
    GQLSelectableOption,
    GQLSurvey,
} from "../interfaces/GQLInterface";
import { removeTypenameAndConvertToCamelCase } from "../utils/SnakeToCamel";
import { log, logObject } from "../utils/Log";
import SelectionResponseContainer, {
    QuestionResponseContainerProps,
} from "../components/SelectionResponseContainer";
import { ListRenderItem } from "react-native";
import { marginSizes } from "../utils/sizes";
import { convertIdToType } from "../enums/QuestionTypeEnum";
import { colors } from "../utils/colors";
import { screenWidth } from "../utils/ScreenSize";
import EssayResponseContainer from "../components/EssayResponseContainer";

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

    const [isShowingOverall, setIsShowingOverall] = useState<boolean>(true);

    const [responseProps, setResponseProps] = useState<
        QuestionResponseContainerProps[]
    >([]);

    useEffect(() => {
        console.log("passed survey id:", surveyId);

        if (answersData?.answers) {
            const updatedAnswer: GQLAnswer[] =
                removeTypenameAndConvertToCamelCase(answersData.answers);
            logObject("fetched answers", updatedAnswer);
            setAnswers(updatedAnswer);
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
        if (answers && answers.length !== 0 && survey !== null) {
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
                        // questionType: questionType,
                    };
                    logObject("prop obj", props);

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

    if (surveyLoading || answersLoading) {
        return <Text>Loading...</Text>;
    }

    const questionResponseBoxItem: ListRenderItem<
        QuestionResponseContainerProps
    > = ({ item }) => {
        return item.questionTypeId !== "300" ? (
            <SelectionResponseContainer
                questionTitle={item.questionTitle}
                selectableOptions={item.selectableOptions}
                answers={item.answers}
                questionTypeId={item.questionTypeId}
            />
        ) : (
            <EssayResponseContainer
                questionTitle={item.questionTitle}
                selectableOptions={item.selectableOptions}
                answers={item.answers}
                questionTypeId={item.questionTypeId}
            />
        );
    };

    const listFooter = (currentParticipation: number) => {
        return <Text>{currentParticipation}</Text>;
    };

    return (
        <View style={styles.container}>
            <Text style={{ color: colors.gray3 }}>surveyId: {surveyId}</Text>
            <Text
                style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    textAlign: "center",
                }}
            >
                {survey.title ?? ""}
            </Text>
            <View style={{ height: 30 }} />
            <FlatList
                data={responseProps}
                renderItem={questionResponseBoxItem}
                keyExtractor={item => `${item.questionTitle}`}
                ItemSeparatorComponent={() => {
                    return <View style={{ height: 10 }} />;
                }}
                style={{ marginBottom: 200 }}
                ListFooterComponent={listFooter(survey.currentParticipation)} // 총 설문 인원,
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: marginSizes.s12,
    },
});
