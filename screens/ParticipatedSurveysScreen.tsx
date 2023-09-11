import { useEffect, useState } from "react";
import { Text } from "react-native";
import { loadUserState } from "../utils/Storage";
import { Survey } from "../interfaces/Survey";
import { login } from "../API/UserAPI";
import axios, { Axios } from "axios";
import { logObject } from "../utils/Log";
import { API_BASE_URL } from "../API/API";

function ParticipatedSurveysScreen() {
    const [userId, setUserId] = useState<number>(0);
    const [participatedSurveys, setParticipatedSurveys] =
        useState<Survey>(undefined);

    const getParticipatedSurveys = async () => {
        const myUserId = (await loadUserState()).userId;
        axios({
            method: "GET",
            url: `${API_BASE_URL}/user/${myUserId}/participated-surveys`,
        }).then(res => console.log(res.data));
    };

    useEffect(() => {
        console.log(`hi!`);
        getParticipatedSurveys();
    }, []);

    return <Text>ParticipatedSurveys</Text>;
}

export default ParticipatedSurveysScreen;
