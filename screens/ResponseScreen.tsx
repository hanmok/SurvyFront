import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import { FlatList, Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { AnswerResponse, SurveyResponse } from "../interfaces/SurveyResponse";
import { getAnswersQuery, getSurveyQuery } from "../API/gqlQuery";
import { useApollo } from "../ApolloProvider";
import { Survey } from "../interfaces/Survey";
import { useEffect, useState } from "react";
import { Answer } from "../interfaces/Answer";
import { removeTypenameAndConvertToCamelCase } from "../utils/SnakeToCamel";
import { logObject } from "../utils/Log";
import { QuestionResponseContainerProps } from "../components/QuestionResponseContainer";

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

    const [survey, setSurvey] = useState<Survey | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        console.log("passed survey id:", surveyId);

        if (answersData?.answers) {
            const updatedAnswer: Answer[] = removeTypenameAndConvertToCamelCase(
                answersData.answers
            );
            logObject("fetched answers", updatedAnswer);
            setAnswers(updatedAnswer);
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
            let questionResponseContainerProps: QuestionResponseContainerProps[] =
                [];
            logObject("survey:", survey);
            logObject("answers:", answers);
        }
    }, [answers, survey]);

    if (surveyError || answersError) {
        return <Text>{surveyError?.message || answersError?.message}</Text>;
    }

    if (surveyLoading || answersLoading) {
        return <Text>Loading...</Text>;
    }

    // const questionResponseContainer =

    return (
        <View>
            <Text>Response Screen</Text>
            <Text>surveyId:</Text>
            <Text></Text>
            <Text>{surveyId}</Text>
            <Text>{answers.length} answers has fetched</Text>
            {/* <FlatList data={answers} renderItem={} /> */}
        </View>
    );
}
