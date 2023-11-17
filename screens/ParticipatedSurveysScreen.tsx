import { useEffect } from "react";
import ParticipatedSurveyItems from "../components/mypage/ParticipatedSurveyItems";
import { useCustomContext } from "../features/context/CustomContext";
import { useApollo } from "../ApolloProvider";
import { useQuery } from "@apollo/client";
import { participatedSurveyQuery } from "../API/gqlQuery";
import { convertKeysToCamelCase } from "../utils/SnakeToCamel";
import { Text, View } from "react-native";

export interface ParticipatedSurveyItem {
    title: string;
    reward: number;
    id: number;
    createdAt: number;
}

interface ParticipatedSurveyResponse {
    user: {
        participated_surveys: ParticipatedSurveyItem[];
    };
}

function ParticipatedSurveysScreen() {
    const { userId } = useCustomContext();

    const client = useApollo();
    const { loading, error, data } = useQuery<ParticipatedSurveyResponse>(
        participatedSurveyQuery,
        { client, variables: { userId: userId }, fetchPolicy: "no-cache" }
    );

    const participatedSurveys: ParticipatedSurveyItem[] =
        data?.user.participated_surveys.map(item =>
            convertKeysToCamelCase(item)
        ) || [];

    const { updateLoadingStatus } = useCustomContext();

    useEffect(() => {
        updateLoadingStatus(loading);
    }, [loading]);

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    return participatedSurveys.length !== 0 ? (
        <View style={{ marginTop: 20 }}>
            <ParticipatedSurveyItems
                participatedSurveys={participatedSurveys}
            />
        </View>
    ) : (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text>참여한 설문이 없습니다</Text>
        </View>
    );
}

export default ParticipatedSurveysScreen;
