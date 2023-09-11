import { useEffect, useState } from "react";
import { Text } from "react-native";
import { Survey } from "../interfaces/Survey";
import { loadUserState } from "../utils/Storage";
import axios from "axios";
import { API_BASE_URL } from "../API/API";

function PostedSurveysScreen() {
    const [postedSurveys, setPostedSurveys] = useState<Survey[]>([]);

    const getPostedSurveys = async () => {
        const myUserId = (await loadUserState()).userId;
        axios({
            method: "GET",
            url: `${API_BASE_URL}/user/${myUserId}/posted-surveys`,
        }).then(res => {
            console.log(res.data);
            setPostedSurveys(res.data);
        });
    };

    useEffect(() => {
        console.log(`hi! posted Surveys`);
        getPostedSurveys();
    }, []);

    return <Text>PostedSurveys</Text>;
}

export default PostedSurveysScreen;
