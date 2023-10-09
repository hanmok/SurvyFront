import { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import { loadUserState } from "../utils/Storage";
import { Survey } from "../interfaces/Survey";
import { login } from "../API/UserAPI";
import axios, { Axios } from "axios";
import { logObject } from "../utils/Log";
import { API_BASE_URL } from "../API/API";
import BlockView from "../components/BlockView";
import ParticipatedSurveyItems from "../components/mypage/ParticipatedSurveyItems";

function ParticipatedSurveysScreen() {
    const [userId, setUserId] = useState<number>(null);

    // const [participatedSurveys, setParticipatedSurveys] = useState<number>(undefined);

    useEffect(() => {
        const getUserId = async () => {
            const userId = await loadUserState();
            setUserId(userId.userId);
        };

        getUserId();
    }, [userId]);

    return <ParticipatedSurveyItems userId={userId} />;
}

export default ParticipatedSurveysScreen;
