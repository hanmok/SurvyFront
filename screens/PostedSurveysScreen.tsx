import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Survey } from "../interfaces/Survey";
import { loadUserState } from "../utils/Storage";
import axios from "axios";
import { API_BASE_URL } from "../API/API";
import BlockView from "../components/BlockView";
import PostedSurveyItems from "../components/mypage/PostedSurveyItems";

// userId 는 App 전체에 나눠줄 수 없나 ??

function PostedSurveysScreen() {
    const [userId, setUserId] = useState<number>(null);

    useEffect(() => {
        const getUserId = async () => {
            const userId = await loadUserState();
            setUserId(userId.userId);
        };

        getUserId();
    }, [userId]);

    return <PostedSurveyItems userId={userId} />;
}

export default PostedSurveysScreen;
