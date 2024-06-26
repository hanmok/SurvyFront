import { useCustomContext } from "../../features/context/CustomContext";
import { useApollo } from "../../ApolloProvider";
import { useQuery } from "@apollo/client";
import { participatedSurveyQuery } from "../../API/gqlQuery";
import { ParticipatedSurveyItem } from "../ParticipatedSurveysScreen";
import { convertKeysToCamelCase } from "../../utils/SnakeToCamel";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../../utils/NavHelper";

interface ParticipatedSurveyResponse {
    user: {
        participated_surveys: ParticipatedSurveyItem[];
    };
}

function PointHistoryScreen({
    navigation,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.pointHistory
    >;
}) {
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

    useEffect(() => {
        updateLoadingStatus(loading);
    }, [loading]);

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    return participatedSurveys.length !== 0 ? (
        <View style={{ marginTop: 20 }}>
            {/* <ParticipatedSurveyItems
                participatedSurveys={participatedSurveys}
            /> */}
        </View>
    ) : (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text>조회할 포인트 내역이 없습니다.</Text>
        </View>
    );
}

export default PointHistoryScreen;
