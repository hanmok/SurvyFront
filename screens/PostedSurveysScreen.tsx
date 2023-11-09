import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Survey } from "../interfaces/Survey";
import { loadUserState } from "../utils/Storage";
import axios from "axios";
import { API_BASE_URL } from "../API/API";
import BlockView from "../components/BlockView";
import PostedSurveyItems from "../components/mypage/PostedSurveyItems";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import { useApollo } from "../ApolloProvider";

// userId 는 App 전체에 나눠줄 수 없나 ??

function PostedSurveysScreen({
    navigation,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.postedSurveys
    >;
}) {
    const [userId, setUserId] = useState<number>(null);

    useEffect(() => {
        const getUserId = async () => {
            const userId = await loadUserState();
            setUserId(userId.userId);
        };
        getUserId();
    }, [userId]);

    // 최신이 위로 가도록.
    return (
        <PostedSurveyItems
            userId={userId}
            handleTapAction={surveyId => {
                navigation.navigate(NavigationTitle.response, {
                    surveyId,
                });
            }}
        />
    );
}

export default PostedSurveysScreen;
