import { useEffect } from "react";
import ParticipatedSurveyItems from "../components/mypage/ParticipatedSurveyItems";
import { useCustomContext } from "../features/context/CustomContext";
import { useApollo } from "../ApolloProvider";
import { useQuery } from "@apollo/client";
import {
    participatedSurveyQuery,
    participatingsByUserIdQuery,
} from "../API/gqlQuery";
import { convertKeysToCamelCase } from "../utils/SnakeToCamel";
import { Text, View } from "react-native";
import ParticipatingItems from "../components/mypage/ParticipatingItems";

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

export interface ParticipatingItem {
    id: number;
    // createdAt: number;
}

interface ParticipatingResponse {
    participatingsByUserId: ParticipatingItem[];
}

// 참여한 설문
function ParticipatedSurveysScreen() {
    const { userId } = useCustomContext();
    const { updateLoadingStatus } = useCustomContext();

    const client = useApollo();

    const { loading, error, data } = useQuery<ParticipatedSurveyResponse>(
        participatedSurveyQuery,
        { client, variables: { userId: userId }, fetchPolicy: "no-cache" }
    );

    const participatedSurveys: ParticipatedSurveyItem[] =
        data?.user.participated_surveys.map(item =>
            convertKeysToCamelCase(item)
        ) || [];

    const {
        loading: pLoading,
        error: pError,
        data: pData,
    } = useQuery<ParticipatingResponse>(participatingsByUserIdQuery, {
        client,
        variables: { userId: userId },
        fetchPolicy: "no-cache",
    });

    const participatings: ParticipatingItem[] =
        pData?.participatingsByUserId.map(item =>
            convertKeysToCamelCase(item)
        ) || [];

    useEffect(() => {
        updateLoadingStatus(loading);
    }, [loading]);

    // if (error) {
    //     return <Text>Error: {error.message}</Text>;
    // }

    if (pError) {
        return <Text>Error: {pError.message}</Text>;
    }

    return participatedSurveys.length !== 0 ? (
        <View>
            <View style={{ marginTop: 20 }}>
                <ParticipatedSurveyItems
                    participatedSurveys={participatedSurveys}
                />
            </View>

            <View style={{ marginTop: 20 }}>
                <ParticipatingItems participatings={participatings} />
            </View>
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
