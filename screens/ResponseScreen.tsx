import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { AnswerResponse, SurveyResponse } from "../interfaces/SurveyResponse";
import { getAnswersQuery, getSurveyQuery } from "../API/gqlQuery";
import { useApollo } from "../ApolloProvider";
import { Survey } from "../interfaces/Survey";
import { useEffect, useState } from "react";
import { Answer, GQLAnswer } from "../interfaces/Answer";
import { removeTypenameAndConvertToCamelCase } from "../utils/SnakeToCamel";
import { log, logObject } from "../utils/Log";
import QuestionResponseContainer, {
    QuestionResponseContainerProps,
} from "../components/QuestionResponseContainer";
import { ListRenderItem } from "react-native";
import { marginSizes } from "../utils/sizes";

// SurveyId 를 받아야해.
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
    } = useQuery<AnswerResponse>(getAnswersQuery, {
        client,
        variables: { surveyId: route.params.surveyId },
    });

    const {
        loading: surveyLoading,
        error: surveyError,
        data: surveyData,
    } = useQuery<SurveyResponse>(getSurveyQuery, {
        client,
        variables: { surveyId: route.params.surveyId },
    });

    const [responseProps, setResponseProps] = useState<
        QuestionResponseContainerProps[]
    >([]);

    // const [questionResponseContainerProps, setQuestionResponseContainerProps] = useState<QuestionResponseContainerProps[]>([]);

    const [survey, setSurvey] = useState<Survey | null>(null);
    // const [answers, setAnswers] = useState<Answer[]>([]);
    const [answers, setAnswers] = useState<GQLAnswer[]>([]);

    useEffect(() => {
        console.log("passed survey id:", surveyId);

        if (answersData?.answers) {
            // const updatedAnswer: Answer[] = removeTypenameAndConvertToCamelCase(
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
            const updatedSurvey: Survey = removeTypenameAndConvertToCamelCase(
                surveyData.survey
            );
            logObject("fetched survey", updatedSurvey);
            setSurvey(updatedSurvey);
        }
    }, [surveyData]);

    useEffect(() => {
        if (answers.length !== 0 && survey !== null) {
            // make QuestionResponseContainerProps
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
                        questionTitle: ` ${question.position} ${question.text}`,
                        selectableOptions: selectableOptions,
                        answers: tempAnswers,
                    };

                    tempQuestionResponseContainerProps.push(props);
                });
            });
            setResponseProps(tempQuestionResponseContainerProps);
        }
    }, [answers, survey]);

    if (surveyError || answersError) {
        return <Text>{surveyError?.message || answersError?.message}</Text>;
    }

    if (surveyLoading || answersLoading) {
        return <Text>Loading...</Text>;
    }

    const questionResponseBoxItem: ListRenderItem<
        QuestionResponseContainerProps
    > = ({ item }) => {
        return (
            <QuestionResponseContainer
                questionTitle={item.questionTitle}
                selectableOptions={item.selectableOptions}
                answers={item.answers}
            />
        );
    };

    return (
        <View style={styles.container}>
            <Text>surveyId: {surveyId}</Text>
            {/* <Text>{answers.length} answers has fetched</Text> */}
            <Text>{survey.currentParticipation} answers has fetched</Text>
            <View style={{ height: 30 }} />
            <FlatList
                data={responseProps}
                renderItem={questionResponseBoxItem}
                keyExtractor={item => `${item.questionTitle}`}
                ItemSeparatorComponent={() => {
                    return <View style={{ height: 10 }} />;
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: marginSizes.s12,
    },
});
