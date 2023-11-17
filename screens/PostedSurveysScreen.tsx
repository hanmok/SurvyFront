import { useEffect, useState } from "react";
import { loadUserState } from "../utils/Storage";
import PostedSurveyItems from "../components/mypage/PostedSurveyItems";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import { useCustomContext } from "../features/context/CustomContext";

function PostedSurveysScreen({
    navigation,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.postedSurveys
    >;
}) {
    // const [userId, setUserId] = useState<number>(null);

    const { accessToken, userId } = useCustomContext();

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
