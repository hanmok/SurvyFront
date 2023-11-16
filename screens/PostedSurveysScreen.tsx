import { useEffect, useState } from "react";
import { loadUserState } from "../utils/Storage";
import PostedSurveyItems from "../components/mypage/PostedSurveyItems";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";

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
