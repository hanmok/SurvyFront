import { useEffect } from "react";
// import ParticipatedSurveyItems from "../components/mypage/ParticipatedSurveyItems";
import { useCustomContext } from "../features/context/CustomContext";
import { useApollo } from "../ApolloProvider";
import { useQuery } from "@apollo/client";
import { participatedSurveyQuery } from "../API/gqlQuery";
import { convertKeysToCamelCase } from "../utils/SnakeToCamel";
import { Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { commonStyles } from "../utils/CommonStyles";
import { fontSizes, marginSizes } from "../utils/sizes";
import accounting from "accounting";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";

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

// 참여한 설문
function ParticipatedSurveysScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.home>;
}) {
    const { userId, updateLoadingStatus } = useCustomContext();

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
            <FlatList
                data={participatedSurveys}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate(NavigationTitle.response, {
                                surveyId: item.id,
                            });
                        }}
                        style={[
                            commonStyles.border,
                            {
                                marginHorizontal: marginSizes.m16,
                                borderRadius: 10,
                                marginBottom: 12,
                                padding: 8,
                                gap: 6,
                            },
                        ]}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: fontSizes.m20,
                                    fontWeight: "bold",
                                }}
                            >
                                {item.title}
                            </Text>
                            <Text>
                                +{accounting.formatNumber(item.reward)} P
                            </Text>
                        </View>
                        {/* <Text>{convertTime(item.createdAt)}</Text> */}
                    </TouchableOpacity>
                )}
                // 참여한 날짜가 아니야.
                // keyExtractor={item => `${item.code}${item.created_at}`}

                keyExtractor={item => `${item.id}${item.title}`}
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
