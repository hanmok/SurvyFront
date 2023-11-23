import { useEffect, useState } from "react";
import { Text, View } from "react-native";
// import { loadUserState } from "../utils/Storage";
import PostedSurveyItems from "../components/mypage/PostedSurveyItems";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import { useCustomContext } from "../features/context/CustomContext";
import { useApollo } from "../ApolloProvider";
import { useQuery } from "@apollo/client";
import { PostedSurveyResponse } from "../API/gqlResponses";
import { postedSurveyQuery } from "../API/gqlQuery";
import { GQLSurvey } from "../interfaces/GQLInterface";
import { logObject } from "../utils/Log";
import { removeTypenameAndConvertToCamelCase } from "../utils/SnakeToCamel";
import { fontSizes } from "../utils/sizes";

// 요청한 설문
function PostedSurveysScreen({
    navigation,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.postedSurveys
    >;
}) {
    const { accessToken, userId, updateLoadingStatus } = useCustomContext();

    const client = useApollo();

    const { loading, error, data } = useQuery<PostedSurveyResponse>(
        postedSurveyQuery,
        { client, variables: { userId: userId }, fetchPolicy: "no-cache" }
    );

    const [postedSurveys, setPostedSurveys] = useState<GQLSurvey[]>([]);

    useEffect(() => {
        if (data?.user.posted_surveys) {
            logObject("get postedSurveyObj using user", data.user);
            const updatedPostedSurveys: GQLSurvey[] =
                removeTypenameAndConvertToCamelCase(data.user.posted_surveys);
            logObject("get postedSurveyObj", updatedPostedSurveys);
            updatedPostedSurveys.sort((a, b) => {
                return Number(b.createdAt) - Number(a.createdAt);
            });
            setPostedSurveys(updatedPostedSurveys);
        }
    }, [data]);

    useEffect(() => {
        updateLoadingStatus(loading);
    }, [loading]);

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    // 최신이 위로 가도록.

    return postedSurveys.length !== 0 ? (
        <PostedSurveyItems
            postedSurveys={postedSurveys}
            handleTapAction={surveyId => {
                navigation.navigate(NavigationTitle.response, {
                    surveyId,
                });
            }}
        />
    ) : (
        <View
            style={{
                // backgroundColor: "magenta",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ fontSize: fontSizes.m20 }}>
                요청한 설문이 없습니다.
            </Text>
        </View>
    );
}

export default PostedSurveysScreen;
